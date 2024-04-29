const asyncHandler = require("express-async-handler");
const { DB_getItemByID } = require("../services/Item_Services");
const {
    DB_orderAdditem,
    DB_updateOrderItemQuantity,
    DB_getOngoingOrder,
    DB_createOrder,
    DB_isItemInOrder,
    DB_updateOrder,
    DB_orderDeleteItem,
} = require("../services/Order_Services");

/**
 *@brief Checks if the item exists in out system and if the quantity requested is available.
 *
 * @param {*} Item_ID : ID of the item to check.
 * @param {*} Quantity: Quantity requested.
 * @param {*} res     : Response object.
 * @returns           : An object containing the item information.
 */
const validateRequest = asyncHandler(async (Item_ID, Quantity, res) => {
    //Check if the item exists
    const response = await DB_getItemByID(Item_ID);

    const item = response[0][0];
    if (!item) {
        res.status(404);
        throw new Error(`Item ${Item_ID} not found.`);
    }

    //Check if the requested quantity of the item is more than what is available.
    if (Quantity > item.Quantity) {
        res.status(400);
        throw new Error(
            `The requested quantity is not available only ${item.Quantity} in stock.`
        );
    }

    return item;
});

/**
 * @brief Adds a new item to the customer's order.
 * @route POSt /customers/orders
 *
 * @brief Updates the quantity of an item in the order.
 * @route PUT /customers/orders
 *
 * @access private
 */
const orderAddItem = asyncHandler(async (req, res, next) => {
    const customerID = req.user;
    const { Item_ID, Quantity } = req.body;

    const item = await validateRequest(Item_ID, Quantity, res);

    const order = await DB_getOngoingOrder(customerID);
    let orderID;
    let totalItemPrice = item.Price * Quantity;

    //Check is there is an old order already created for the customer
    if (!order) {
        orderID = await DB_createOrder(customerID);
    } else {
        orderID = order.Order_ID;

        //Update the total order price
        totalItemPrice += order.Total_payment;
    }

    //Check if the item is already added in the order and if yes update the quantity.
    const itemSearchResult = await DB_isItemInOrder(Item_ID, orderID);
    if (itemSearchResult) {
        await DB_updateOrderItemQuantity(orderID, Item_ID, Quantity, res);

        if (order) {
            totalItemPrice -= itemSearchResult.Quantity * item.Price;
        }
    } else {
        await DB_orderAdditem(orderID, Item_ID, Quantity, item.Price);
    }

    const attribute = "Total_payment";
    await DB_updateOrder(orderID, attribute, totalItemPrice);

    res.status(200).json({
        message: `Item ${Item_ID} added in order: ${orderID} successfully`,
        orderData: {
            orderID,
            totalItemPrice,
        },
    });
});

/**
 * @brief Calulates the new order order price after deleting the item.
 *
 * @param {*} Order_ID      : ID of the order to be updated.
 * @param {*} Item_ID       : ID of the deleted item.
 * @param {*} Quantity      : Quantity of the item.
 * @param {*} Order_Price   : Old item price.
 */
const updateOrderPrice = async (
    Order_ID,
    Quantity,
    Item_Price,
    Order_Price
) => {
    try {
        Order_Price -= Quantity * Item_Price;

        const attribute = "Total_payment";
        await DB_updateOrder(Order_ID, attribute, Order_Price);

        return Order_Price;
    } catch (error) {
        throw new Error(error.message);
    }
};
/**
 * @brief Deletes an item from the customer's order.
 *
 * @route DELETE /customers/orders/:Item_ID
 *
 * @access private
 */
const orderDeleteItem = asyncHandler(async (req, res) => {
    const Item_ID = req.params.Item_ID;
    const customerID = req.user;

    const order = await DB_getOngoingOrder(customerID);

    if (!order) {
        res.status(404);
        throw new Error(`There is no cart for customer with ID: ${customerID}`);
    }

    const Order_ID = order.Order_ID;
    const itemSearchResult = await DB_isItemInOrder(Item_ID, Order_ID);

    if (!itemSearchResult) {
        res.status(404);
        throw new Error(
            `Customer's cart doesn't contain item with ID: ${Item_ID}`
        );
    }

    await DB_orderDeleteItem(Order_ID, Item_ID);

    const totalItemPrice = await updateOrderPrice(
        Order_ID,
        itemSearchResult.Quantity,
        itemSearchResult.Price,
        order.Total_payment
    );

    res.status(200).json({
        message: `Item ${Item_ID} deleted from order: ${Order_ID} successfully`,
        orderData: {
            Order_ID,
            totalItemPrice,
        },
    });
});

module.exports = { orderAddItem, orderDeleteItem };
