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

const DB_getItemByCategory = async (category) => {
    let connection;
    try {
        connection = await pool.getConnection();

        query =
            "SELECT item.*, ( SELECT GROUP_CONCAT(Category) FROM item_category \
                WHERE item_category.C_Item_ID = item.Item_ID) AS Categories\
                FROM item JOIN  item_category ON item.Item_ID = item_category.C_Item_ID\
                WHERE item_category.Category = ?";

        const result = await connection.query(query, [category]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to find items in ${category} category ` + error.message
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
module.exports = { DB_addItem, DB_getCategories, DB_getItemByCategory };
