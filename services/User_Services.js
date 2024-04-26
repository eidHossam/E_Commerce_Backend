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
module.exports = { DB_registerUser, DB_searchUser };
