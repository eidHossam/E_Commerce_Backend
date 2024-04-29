const pool = require("../config/DB_Connection");
const { orderConstants } = require("../utils/Constants");

/**
 * @brief Function to get the current date.
 *
 * @returns : String of the current date in the form YYYY-MM-DD
 */
const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const currentDate = `${year}-${month}-${day}`;

    return currentDate;
};

/**
 * @brief Checks if the customer already has an ongoing order.
 *
 * @param {*} customerID : ID of the customer to check the order.
 * @returns              : The order object
 */
const DB_getOngoingOrder = async (customerID) => {
    try {
        const query = `SELECT * FROM order_ WHERE \`O_UserID\` = ? AND \`status\` = "${orderConstants.ONGOING}"`;

        const order = await pool.query(query, [customerID]);

        return order[0][0];
    } catch (error) {
        throw new Error(
            `Failed to find orders for customer: ${customerID} ${error.message}`
        );
    }
};

/**
 * @brief Checks if the item is already in the order.
 *
 * @param {*} itemID    : ID of the item to be checked.
 * @param {*} orderID   : ID of the order to be checked.
 * @returns             : The item we are checking if it exists in the order.
 */
const DB_isItemInOrder = async (itemID, orderID) => {
    try {
        const query =
            "SELECT * FROM order_items WHERE `Order_ID` = ? AND `Item_ID` = ?";

        const item = await pool.query(query, [orderID, itemID]);

        return item[0][0];
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * @brief : Creates a new order for a specific customer.
 *
 * @param {*} customerID : Customer ID to create a new order for.
 * @param {*} totalPrice : Total price for the order.
 * @param {*} res        : Response object
 * @returns              : ID of the created order.
 */
const DB_createOrder = async (customerID) => {
    try {
        const query =
            "INSERT INTO `order_` (`Order_date`, `Status`, `O_UserID`) VALUES (?, ?, ?)";

        const currentDate = getCurrentDate();

        const orderDetails = await pool.query(query, [
            currentDate,
            orderConstants.ONGOING,
            customerID,
        ]);

        return orderDetails[0].insertId;
    } catch (error) {
        throw new Error(`Failed to create new order ${error.message}`);
    }
};

/**
 * @brief Updates a specific order attribute.
 *
 * @param {*} orderID   : ID of the order to be updated.
 * @param {*} attribute : Order attribute to be updated.
 * @param {*} value     : Order attribute value to be updated.
 */
const DB_updateOrder = async (orderID, attribute, value) => {
    try {
        const query = `UPDATE order_ SET ${attribute} = ? WHERE \`Order_ID\` = ?`;

        await pool.query(query, [value, orderID]);
    } catch (error) {
        throw new Error(`Failed to update order ${orderID} ${error.message}`);
    }
};

const DB_updateOrderItemQuantity = async (orderID, Item_ID, Quantity) => {
    try {
        const query =
            "UPDATE order_items SET `Quantity` = ? WHERE `Order_ID` = ? AND `Item_ID` = ?";

        await pool.query(query, [Quantity, orderID, Item_ID]);
    } catch (error) {
        throw new Error("Couldn't update order quantity: " + error.message);
    }
};

/**
 * @brief Adds a new item to the customer's ongoin order.
 *
 * @param {*} customerID    : ID of the customer to add to the item to his order.
 * @param {*} itemID        : ID of the item to add to the order.
 * @param {*} quantity      : Quantity of the item to add to the order
 * @param {*} price         : Price of the item to add to the order.
 */
const DB_orderAdditem = async (orderID, itemID, quantity, price) => {
    try {
        const query =
            "INSERT INTO order_items (`Order_ID`, `Item_ID`, `Quantity`, `Price`) VALUES (?, ?, ?, ?)";
        await pool.query(query, [orderID, itemID, quantity, price]);

        return orderID;
    } catch (error) {
        throw new Error(
            `Failed to insert item: ${itemID} into the order, ${error.message}`
        );
    }
};

/**
 * @brief Deletes an item from the given customer order.
 *
 * @param {*} Order_ID  : ID of the order to delete the item from.
 * @param {*} Item_ID   : ID of the item to delete.
 * @returns             : Result object of the query.
 */
const DB_orderDeleteItem = async (Order_ID, Item_ID) => {
    try {
        const query =
            "DELETE FROM `order_items` WHERE `Order_ID` = ? AND `Item_ID` = ?";

        const result = await pool.query(query, [Order_ID, Item_ID]);

        return result;
    } catch (error) {
        throw new Error(
            `Failed to delete item: ${Item_ID} in order: ${Order_ID}, ${error.message}`
        );
    }
};

/**
 * @brief Deletes a customer's ongoing order
 *
 * @param {*} Order_ID  : ID of the order to be deleted.
 * @returns             : Result object of the query.
 */
const DB_deleteOrder = async (Order_ID) => {
    try {
        const query = "DELETE FROM `order_` WHERE `Order_ID` = ?";

        const result = await pool.query(query, [Order_ID]);

        return result;
    } catch (error) {
        throw new Error(`Could not delete order ${Order_ID}, ${error.message}`);
    }
};

module.exports = {
    DB_orderAdditem,
    DB_updateOrderItemQuantity,
    DB_getOngoingOrder,
    DB_isItemInOrder,
    DB_createOrder,
    DB_updateOrder,
    DB_orderDeleteItem,
    DB_deleteOrder,
};
