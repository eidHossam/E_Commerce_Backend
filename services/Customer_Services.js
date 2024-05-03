const pool = require("../config/DB_Connection");
const { findUser } = require("../utils/UserUtils");

/**
 * @breif Adds the customer additional information
 *
 * @param {*} userID         : ID of the user
 * @param {*} insertionTable : The table to insert the customer in.
 * @param {*} data           : Data of th user to be inserted
 * @param {*} res            : Response object.
 * @returns                  : Result of the insertion process
 */
const addCustomerInfo = async (userID, insertionTable, data, res) => {
    try {
        const searchTable = "customer";
        await findUser(searchTable, userID, res);

        const DBResult = await DB_addCustomerInfo(
            insertionTable,
            userID,
            data,
            res
        );

        return DBResult;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * @brief Function to add additional user information.
 *
 * @param {*} table : Table to add user information in.
 * @param {*} userID: User ID to add user information for.
 * @param {*} data  : Data to be added.
 * @param {*} res   : the API response object to be able to change the status in case of failure.
 * @returns         : the query result object in case of success.
 */
const DB_addCustomerInfo = async (table, userID, data, res) => {
    try {
        let query;
        if (table === "customer_address") {
            query =
                "INSERT INTO `customer_address` (`C_UserID`, `Address`) VALUES (?, ?)";
        } else if (table === "customer_card") {
            query =
                "INSERT INTO `customer_card` (`C_UserID`, `Card_no`) VALUES (?, ?)";
        }

        const result = await pool.query(query, [userID, data]);

        return result;
    } catch (error) {
        res.status(409);
        throw new Error(`Failed to add ${table} in SQL: ` + error.message);
    }
};

/**
 * @breif : Retreive all the address associated with a given customer
 *
 * @param {*} userID : ID of the customer to search for
 * @param {*} res    : Response object
 * @returns          : Array of addresses.
 */
const DB_getCustomerAddress = async (userID, res) => {
    try {
        const query =
            "SELECT `Address` FROM `customer_address` WHERE `C_UserID` = ?";

        const result = await pool.query(query, [userID]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to get ${userID} addresses: ` + error.message);
    }
};

/**
 * @breif : Retreive all the cards associated with a given customer
 *
 * @param {*} userID : ID of the customer to search for
 * @param {*} res    : Response object
 * @returns          : Array of cards.
 */
const DB_getCustomerCard = async (userID, res) => {
    try {
        const query =
            "SELECT `Card_no` FROM `customer_card` WHERE `C_UserID` = ?";

        const result = await pool.query(query, [userID]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to get ${userID} cards: ` + error.message);
    }
};

/**
 * @breif Retrieves a list of the customer's purchase history.
 *
 * @param {*} customerID : ID of the customer to retrieve purchase history for.
 * @returns              : Array of purchase history.
 */
const DB_CustomerPurchaseHistory = async (customerID) => {
    try {
        const query =
            'SELECT order_.Order_ID, order_.Total_payment, order_.Order_date, order_items.Item_ID, item.Name, order_items.Price, order_items.Quantity, item.URL  \
            from order_, order_items, item WHERE order_.O_UserID = ? AND order_.Status = "Completed" \
            AND order_items.Order_ID = order_.Order_ID AND order_items.Item_ID = item.Item_ID';

        const [rows, fields] = await pool.execute(query, [customerID]);

        // // Transform the raw result into the desired format
        const purchaseHistory = rows.reduce((acc, row) => {
            // Find the index of the order in the accumulator array
            const orderIndex = acc.findIndex(
                (order) => order.orderID === row.Order_ID
            );

            // If the order is not already in the accumulator array, add it
            if (orderIndex === -1) {
                acc.push({
                    orderID: row.Order_ID,
                    orderDate: row.Order_date,
                    orderPrice: row.Total_payment,
                    items: [
                        {
                            itemID: row.Item_ID,
                            name: row.Name,
                            price: row.Price,
                            quantity: row.Quantity,
                            URL: row.URL,
                        },
                    ],
                });
            } else {
                // If the order is already in the accumulator array, push the item details into its items array
                acc[orderIndex].items.push({
                    itemID: row.Item_ID,
                    name: row.Name,
                    price: row.Price,
                    quantity: row.Quantity,
                    URL: row.URL,
                });
            }

            return acc;
        }, []);

        return purchaseHistory;
    } catch (error) {
        throw new Error(
            `Failed to get ${customerID} purchase history, ${error.message}`
        );
    }
};
module.exports = {
    addCustomerInfo,
    DB_getCustomerAddress,
    DB_getCustomerCard,
    DB_CustomerPurchaseHistory,
};
