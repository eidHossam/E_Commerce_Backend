const asyncHandler = require("express-async-handler");
const {
    DB_orderAdditem,
    DB_updateOrderItemQuantity,
    DB_getOngoingOrder,
    DB_createOrder,
    DB_isItemInOrder,
    DB_updateOrder,
    DB_orderDeleteItem,
    DB_deleteOrder,
    DB_getOrderItems,
    DB_checkoutOrder,
} = require("../services/Order_Services");
const { validationResult } = require("express-validator");
const {
    DB_updateUserBalance,
    DB_getUserBalance,
} = require("../services/User_Services");
const { DB_CustomerPurchaseHistory } = require("../services/Customer_Services");

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

    const itemPrice = req.itemPrice;

    if (Quantity === 0) {
        req.params.Item_ID = Item_ID;
        return orderDeleteItem(req, res);
    }

    const order = await DB_getOngoingOrder(customerID);
    let orderID;
    let totalItemPrice = itemPrice * Quantity;

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
        await DB_updateOrderItemQuantity(orderID, Item_ID, Quantity);

        if (order) {
            totalItemPrice -=
                itemSearchResult.Quantity * itemSearchResult.Price;
        }
    } else {
        await DB_orderAdditem(orderID, Item_ID, Quantity, itemPrice);
    }

    const attribute = "Total_payment";
    await DB_updateOrder(orderID, attribute, totalItemPrice);

    res.status(200).json({
        message: `Item ${Item_ID} added in order: ${orderID} successfully`,
        orderData: {
            orderID,
            OrderCost: totalItemPrice,
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
            OrderCost: totalItemPrice,
        },
    });
});

/**
 * @brief Deletes an item from the customer's order.
 *
 * @route DELETE /customers/orders
 *
 * @access private
 */
const deleteOrder = asyncHandler(async (req, res) => {
    const customerID = req.user;

    const order = await DB_getOngoingOrder(customerID);

    if (!order) {
        res.status(404);
        throw new Error(`Couldn't find cart for customer: ${customerID}`);
    }

    await DB_deleteOrder(order.Order_ID);

    res.status(200).json({
        message: `Order ${order.Order_ID} was successfully deleted.`,
    });
});

/**
 * @brief Gets all the items in the customer's order.
 *
 * @route GET /customers/orders
 *
 * @access private
 */
const getOrder = asyncHandler(async (req, res) => {
    const customerID = req.user;

    const order = await DB_getOngoingOrder(customerID);

    if (!order) {
        res.status(404);
        throw new Error(`Couldn't find cart for customer: ${customerID}`);
    }

    const orderItems = await DB_getOrderItems(order.Order_ID);

    res.status(200).json({
        message: `Getting the customer's ${customerID} cart items.`,
        order,
        items: orderItems,
    });
});

/**
 * @brief Charges the customer's in-store balance.
 *
 * @route PUT /customers/balance
 *
 * @access private
 */
const chargeBalance = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Throw an error in case the user didn't provide a valid information.
        res.status(400);
        return next({ message: errors.array() });
    }

    const customerID = req.user;
    const { amount } = req.body;
    const Balance = await DB_updateUserBalance(customerID, amount, "customer");

    res.status(200).json({
        message: `${customerID} Balance updated successfully)`,
        Balance,
    });
});

/**
 * @brief Checkout the customer's cart using his balance.
 *
 * @route PUT /customers/orders/checkout/balance
 *
 * @access private
 */
const checkoutByBalance = asyncHandler(async (req, res, next) => {
    const customerID = req.user;

    const order = await DB_getOngoingOrder(customerID);

    if (!order) {
        res.status(404);
        throw new Error(`Couldn't find cart for customer: ${customerID}`);
    }

    const customerBalance = await DB_getUserBalance(customerID, "customer");

    if (customerBalance < order.Total_payment) {
        res.status(400);
        throw new Error(`Customer ${customerID} doesn't have enough funds.`);
    }

    await DB_checkoutOrder(customerID, order.Order_ID, res);

    res.status(200).json({
        message: `${customerID} checked out order: ${order.Order_ID} successfully`,
    });
});

/**
 * @brief Gets the customer's entire purchase history.
 *
 * @route GET /customers/history
 *
 * @access private
 */
const customerPurchaseHistory = asyncHandler(async (req, res) => {
    const customerID = req.user;

    const history = await DB_CustomerPurchaseHistory(customerID);

    res.status(200).json({
        message: `Customer ${customerID} history.`,
        history,
    });
});

module.exports = {
    orderAddItem,
    orderDeleteItem,
    deleteOrder,
    getOrder,
    chargeBalance,
    checkoutByBalance,
    customerPurchaseHistory,
};
