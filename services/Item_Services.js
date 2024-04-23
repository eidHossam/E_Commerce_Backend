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

const DB_getCategories = async () => {
    let connection;
    try {
        connection = await pool.getConnection();

        query = "SELECT DISTINCT `Category` FROM `item_category`";

        const result = await connection.query(query);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to retrieve categories ` + error.message);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = { DB_addItem, DB_getCategories };
