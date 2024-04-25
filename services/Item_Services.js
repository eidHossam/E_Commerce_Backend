const pool = require("../config/DB_Connection");

const DB_getCategories = async () => {
    let connection;
    try {
        connection = await pool.getConnection();

        query = "SELECT `Name`, `URL` FROM `category`";

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

const DB_getItemByCategory = async (category, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const query =
            "SELECT item.*,\
            (SELECT GROUP_CONCAT(category.Name) FROM item_category INNER JOIN category ON \
            item_category.Category_ID = category.Category_ID WHERE item_category.Item_ID = item.Item_ID) \
            AS categories FROM item JOIN item_category ON item_category.Item_ID = item.Item_ID \
            JOIN category ON category.Category_ID = item_category.Category_ID \
            WHERE category.Name = ?";

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

const DB_getItemByName = async (itemName, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const itemNamePattern = `%${itemName}%`;

        const query =
            "SELECT item.*,\
            (SELECT GROUP_CONCAT(category.Name) FROM item_category INNER JOIN category \
            ON item_category.Category_ID = category.Category_ID WHERE item_category.Item_ID = item.Item_ID)AS categories\
            FROM item JOIN item_category ON item_category.Item_ID = item.Item_ID \
            JOIN category ON category.Category_ID = item_category.Category_ID \
            WHERE item.Name LIKE ?\
            GROUP BY item.Item_ID";

        const result = await connection.query(query, [itemNamePattern]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to find items with name: ${itemName} ` + error.message
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const DB_getItemByID = async (itemID, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        query = "SELECT * FROM item WHERE Item_ID = ?";

        const result = await connection.query(query, [itemID]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to find item with ID: ${itemID}` + error.message
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    DB_getItemByID,
    DB_getCategories,
    DB_getItemByCategory,
    DB_getItemByName,
};
