const pool = require("../config/DB_Connection");

const DB_registerUser = async (table, user, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Perform the query to register a new user

        let query;
        let queryParams = [user.username, user.email, user.hashedPassword];
        if (table === "customer") {
            query =
                "INSERT INTO `customer` (`Username`, `Email`, `Password`, `Phone_no`) VALUES (?, ?, ?, ?)";
            queryParams.push(user.phoneNum);
        } else if (table === "seller") {
            query =
                "INSERT INTO `seller` (`Username`, `Email`, `Password`) VALUES (?, ?, ?)";
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
module.exports = { DB_registerUser };
