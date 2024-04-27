const pool = require("../config/DB_Connection");

const DB_getCategories = async () => {
    try {
        query = "SELECT `Name`, `URL` FROM `category`";

        const result = await pool.query(query);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to retrieve categories ` + error.message);
    }
};

const DB_getItemByCategory = async (category, res) => {
    try {
        const query =
            "SELECT item.*,\
            (SELECT GROUP_CONCAT(category.Name) FROM item_category INNER JOIN category ON \
            item_category.Category_ID = category.Category_ID WHERE item_category.Item_ID = item.Item_ID) \
            AS categories FROM item JOIN item_category ON item_category.Item_ID = item.Item_ID \
            JOIN category ON category.Category_ID = item_category.Category_ID \
            WHERE category.Name = ?";

        const result = await pool.query(query, [category]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to find items in ${category} category ` + error.message
        );
    }
};

const DB_getItemByName = async (itemName, res) => {
    try {
        const itemNamePattern = `%${itemName}%`;

        const query =
            "SELECT item.*,\
            (SELECT GROUP_CONCAT(category.Name) FROM item_category INNER JOIN category \
            ON item_category.Category_ID = category.Category_ID WHERE item_category.Item_ID = item.Item_ID)AS categories\
            FROM item JOIN item_category ON item_category.Item_ID = item.Item_ID \
            JOIN category ON category.Category_ID = item_category.Category_ID \
            WHERE item.Name LIKE ?\
            GROUP BY item.Item_ID";

        const result = await pool.query(query, [itemNamePattern]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to find items with name: ${itemName} ` + error.message
        );
    }
};

const DB_getItemByID = async (itemID, res) => {
    try {
        query = "SELECT * FROM item WHERE Item_ID = ?";

        const result = await pool.query(query, [itemID]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to find item with ID: ${itemID}` + error.message
        );
    }
};

module.exports = {
    DB_getItemByID,
    DB_getCategories,
    DB_getItemByCategory,
    DB_getItemByName,
};
