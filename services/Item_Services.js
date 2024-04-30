const pool = require("../config/DB_Connection");

/**
 * @brief Gets all the categories from the database with their icons.
 *
 * @returns : An array of all the categories.
 */
const DB_getCategories = async () => {
    try {
        query = "SELECT `Name`, `URL` FROM `category`";

        const result = await pool.query(query);

        return result[0];
    } catch (error) {
        throw new Error(`Failed to retrieve categories ` + error.message);
    }
};

/**
 * @brief Retieves all the items in a certain category.
 *
 * @param {*} category  : The category to retrieve items from.
 * @returns             : An array of the items retrieved with their categories.
 */
const DB_getItemByCategory = async (category) => {
    try {
        const query =
            "SELECT item.*,\
            (SELECT GROUP_CONCAT(category.Name) FROM item_category INNER JOIN category ON \
            item_category.Category_ID = category.Category_ID WHERE item_category.Item_ID = item.Item_ID) \
            AS categories FROM item JOIN item_category ON item_category.Item_ID = item.Item_ID \
            JOIN category ON category.Category_ID = item_category.Category_ID \
            WHERE category.Name = ?";

        const result = await pool.query(query, [category]);

        return result[0];
    } catch (error) {
        throw new Error(
            `Failed to find items in ${category} category ` + error.message
        );
    }
};

/**
 * @brief Retrieves all the items with a certain name.
 *
 * @param {*} itemName  : The name of the item to search for.
 * @returns             : An array of the items retrieved with their categories.
 */
const DB_getItemByName = async (itemName) => {
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

        return result[0];
    } catch (error) {
        throw new Error(
            `Failed to find items with name: ${itemName} ` + error.message
        );
    }
};

/**
 * @brief Gets an item by its ID.
 *
 * @param {*} itemID    : ID of the item to retrieve.
 * @returns             : Object with the item information.
 */
const DB_getItemByID = async (itemID) => {
    try {
        query = "SELECT * FROM item WHERE Item_ID = ?";

        const result = await pool.query(query, [itemID]);

        return result[0][0];
    } catch (error) {
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
