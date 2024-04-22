const pool = require("../config/DB_Connection");

const DB_addItem = async (item, sellerID, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        query =
            "INSERT INTO `item` (`Name`, `Description`, `Price`, `Quantity`, `URL`, `I_UserID`) VALUES (?, ?, ?, ?, ?, ?)";

        const result = await connection.query(query, [
            item.name,
            item.description,
            item.price,
            item.quantity,
            item.url,
            sellerID,
        ]);

        return result;
    } catch (error) {
        res.status(409);
        throw new Error(`Failed to insert ${item.name} ` + error.message);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = { DB_addItem };
