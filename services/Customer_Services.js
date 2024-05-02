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
 * @brief updates the customer's balance.
 *
 * @param {*} customerID    : ID od the customer to be updated.
 * @param {*} balance       : The new balance to be added to the customer.
 *
 * @returns                 : The new balance of the customer.
 */
const DB_updateCustomerBalance = async (customerID, balance) => {
    try {
        const query =
            "UPDATE customer SET `Balance` = `Balance` + ? WHERE `User_ID` = ?";

        await pool.query(query, [balance, customerID]);

        const newBalance = await pool.query(
            "SELECT Balance FROM customer WHERE User_ID = ?",
            [customerID]
        );

        return newBalance[0][0].Balance;
    } catch (error) {
        throw new Error(
            `Could not update customer's balance: ${error.message}`
        );
    }
};

module.exports = {
    addCustomerInfo,
    DB_getCustomerAddress,
    DB_getCustomerCard,
    DB_updateCustomerBalance,
};
