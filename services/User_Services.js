const pool = require("../config/DB_Connection");

/**
 * @brief This function adds a new user [customer, seller] to the database.
 * @param {*} table : specifies the type of user [customer, seller] and the table to insert this user into.
 * @param {*} user  : specifies the user information to be added to the database.
 * @param {*} res   : the API response object to be able to change the status in case of failure.
 * @returns         : the query result object in case of success.
 */
const DB_registerUser = async (table, user, res) => {
    try {
        // Perform the query to register a new user
        let query;
        let queryParams = [user.userID, user.username];
        if (table === "customer") {
            query =
                "INSERT INTO `customer` (`User_ID`, `Username`, `Phone_no`) VALUES (?, ?, ?)";
            queryParams.push(user.phoneNum);
        } else if (table === "seller") {
            query =
                "INSERT INTO `seller` (`User_ID`, `Username`) VALUES (?, ?)";
        }

        const result = await pool.query(query, queryParams);

        return result;
    } catch (error) {
        res.status(409);
        throw new Error(`Failed to create ${table} in SQL: ` + error.message);
    }
};

/**
 * @brief Function to search if a user exits in the specified table.
 * @param {*} table     : The table to search for users in.
 * @param {*} userID    : ID of the user to search for.
 * @param {*} res       : the API response object to be able to change the status in case of failure.
 * @returns             : the query result object in case of success.
 */
const DB_searchUser = async (table, userID, res) => {
    try {
        query = `SELECT * FROM ${table} WHERE User_ID = ?`;

        const result = await pool.query(query, [userID]);

        return result;
    } catch (error) {
        res.status(404);
        throw new Error(`Failed to find ${table}` + error.message);
    }
};

/**
 * @brief Retrieves the User's balance.
 *
 * @param {*} UserID    : ID of the User to retrieve the balance for.
 * @returns                 : Balance of the User.
 */
const DB_getUserBalance = async (UserID, userType) => {
    try {
        const query = `SELECT Balance FROM ${userType} WHERE User_ID = ?`;

        const balance = await pool.query(query, [UserID]);

        return balance[0][0].Balance;
    } catch (error) {
        throw new Error(
            `Failed to get ${userType} ${UserID} balance, ${error.message}`
        );
    }
};

/**
 * @brief updates the User's balance.
 *
 * @param {*} UserID    : ID od the User to be updated.
 * @param {*} balance       : The new balance to be added to the User.
 *
 * @returns                 : The new balance of the User.
 */
const DB_updateUserBalance = async (UserID, balance, userType) => {
    try {
        const query = `UPDATE ${userType} SET \`Balance\` = \`Balance\` + ? WHERE \`User_ID\` = ?`;

        await pool.query(query, [balance, UserID]);

        const newBalance = await DB_getUserBalance(UserID, userType);

        return newBalance;
    } catch (error) {
        throw new Error(
            `Could not update ${userType}'s balance: ${error.message}`
        );
    }
};

module.exports = {
    DB_registerUser,
    DB_searchUser,
    DB_updateUserBalance,
    DB_getUserBalance,
};
