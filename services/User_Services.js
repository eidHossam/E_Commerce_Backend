const pool = require("../config/DB_Connection");

/**
 * @brief This function adds a new user [customer, seller] to the database.
 * @param {*} table : specifies the type of user [customer, seller] and the table to insert this user into.
 * @param {*} user  : specifies the user information to be added to the database.
 * @param {*} res   : the API response object to be able to change the status in case of failure.
 * @returns         : the query result object in case of success.
 */
const DB_registerUser = async (table, user, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

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

        const result = await connection.query(query, queryParams);

        // const warn = await connection.query("SHOW WARNINGS");
        // console.log(warn);

        return result;
    } catch (error) {
        res.status(409);
        throw new Error(`Failed to create ${table} in SQL: ` + error.message);
    } finally {
        // Make sure to release the connection back to the pool
        if (connection) {
            connection.release();
        }
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
    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Perform the query to add a new customer address.

        let query;
        if (table === "customer_address") {
            query =
                "INSERT INTO `customer_address` (`C_UserID`, `Address`) VALUES (?, ?)";
        } else if (table === "customer_card") {
            query =
                "INSERT INTO `customer_card` (`C_UserID`, `Card_no`) VALUES (?, ?)";
        }

        const result = await connection.query(query, [userID, data]);

        // const warn = await connection.query("SHOW WARNINGS");
        // console.log(warn);

        return result;
    } catch (error) {
        res.status(409);
        throw new Error(`Failed to add ${table} in SQL: ` + error.message);
    } finally {
        // Make sure to release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
};

/**
 * @brief Function to search if a user exits in the specified table.
 * @param {*} table : The table to search for users in.
 * @param {*} userID: ID of the user to search for.
 * @param {*} res   : the API response object to be able to change the status in case of failure.
 * @returns         : the query result object in case of success.
 */
const DB_searchUser = async (table, userID, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        query = `SELECT * FROM ${table} WHERE User_ID = ?`;

        const result = await connection.query(query, [userID]);

        return result;
    } catch (error) {
        res.status(404);
        throw new Error(`Failed to find ${table}` + error.message);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
module.exports = { DB_registerUser, DB_addCustomerInfo, DB_searchUser };
