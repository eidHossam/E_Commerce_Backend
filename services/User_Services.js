const pool = require("../config/DB_Connection");

const DB_registerUser = async (username, email, password, phoneNum, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Perform the query to register a new user
        const query =
            "INSERT INTO `customer` (`Username`, `Email`, `Password`, `Phone_no`) VALUES (?, ?, ?, ?)";
        const result = await connection.query(query, [
            username,
            email,
            password,
            phoneNum,
        ]);

        // const warn = await connection.query("SHOW WARNINGS");
        // console.log(warn);

        return result;
    } catch (error) {
        res.status(409);
        throw new Error("Failed to create user in SQL: " + error.message);
    } finally {
        // Make sure to release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
};
module.exports = { DB_registerUser };
