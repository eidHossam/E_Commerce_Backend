const pool = require("../config/DB_Connection");

/**
 * @brief Adds a new item to the database
 *
 * @param {*} item      : The information of the item to be added.
 * @param {*} sellerID  : ID of the seller adding the item to the database.
 * @param {*} res       : Response object.
 * @returns             : Query result
 */
const DB_addItem = async (item, sellerID, res) => {
    try {
        query =
            "INSERT INTO `item` (`Name`, `Description`, `Price`, `Quantity`, `URL`, `I_UserID`)\
             VALUES (?, ?, ?, ?, ?, ?)";

        const result = await pool.query(query, [
            item.Name,
            item.Description,
            item.Price,
            item.Quantity,
            item.URL,
            sellerID,
        ]);

        const itemID = result[0].insertId;

        await DB_addItemCategories(itemID, item.categories, res);

        return result;
    } catch (error) {
        res.status(409);
        throw new Error(`Failed to insert ${item.name} ` + error.message);
    }
};

/**
 * @brief Adds a specific item categories .
 *
 * @param {*} itemID     : ID of the item to add categories for.
 * @param {*} categories : Array of categories to be added.
 */
const DB_addItemCategories = async (itemID, categories, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const searchQuery = "SELECT * FROM `category` WHERE `Name` = ?";
        const insertQuery =
            "INSERT INTO `item_category` (`Item_ID`, `Category_ID`)\
         VALUES (?, ?)";

        for (let i = 0; i < categories.length; i++) {
            const searchResult = await connection.query(searchQuery, [
                categories[i],
            ]);

            if (searchResult[0].length === 0) {
                const deleteQuery = "DELETE FROM `item` WHERE `Item_ID` = ?";
                await connection.query(deleteQuery, [itemID]);
                throw new Error(`${categories[i]} isn't a valid category`);
            }

            await connection.query(insertQuery, [
                itemID,
                searchResult[0][0].Category_ID,
            ]);
        }
    } catch (error) {
        res.status(500);
        throw new Error(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

/**
 * @brief Deletes all the categories assigned for a given item.
 *
 * @param {*} itemID : ID of the item to delete categories for.
 * @param {*} res    : Response object.
 * @returns          : Database operation result object.
 */
const DB_deleteItemCategories = async (itemID, res) => {
    try {
        const query = "DELETE FROM item_category WHERE Item_ID = ?";

        const result = await pool.query(query, [itemID]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to delete item : ${itemID} categories ${error.message}`
        );
    }
};

/**
 * @brief Delete a specific item from the database.
 *
 * @param {*} itemID : ID of the item to be deleted.
 * @param {*} res    : Response object.
 * @returns          : Query result.
 */
const DB_deleteItem = async (itemID, res) => {
    try {
        query = "DELETE FROM item WHERE Item_ID = ?";

        const result = await pool.query(query, [itemID]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to delete item with ID: ${itemID} ` + error.message
        );
    }
};

/**
 * @brief Retrieves all the items posted by this seller.
 *
 * @param {*} sellerID  : The ID of the seller to retrieve the items for.
 * @param {*} res       : Response object.
 * @returns             : Query result.
 */
const DB_getSellerItems = async (sellerID, res) => {
    try {
        query =
            "SELECT item.*,\
        (SELECT GROUP_CONCAT(category.Name) FROM item_category INNER JOIN category ON \
        item_category.Category_ID = category.Category_ID WHERE item_category.Item_ID = item.Item_ID) \
        AS categories FROM item JOIN item_category ON item_category.Item_ID = item.Item_ID \
        JOIN category ON category.Category_ID = item_category.Category_ID \
        WHERE item.I_UserID = ? GROUP BY item.Item_ID";

        const result = await pool.query(query, [sellerID]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to find items for seller with ID: ${sellerID} ` +
                error.message
        );
    }
};

/**
 * @brief Updates the attributes of a given item
 *
 * @param {*} itemID        : ID of the item to update.
 * @param {*} updateQuery   : List of attributes to update.
 * @param {*} values        : New Values of the attributes.
 * @param {*} res           : Response object.
 * @returns                 : Database operation result object.
 */
const DB_updateItem = async (itemID, updateQuery, values, res) => {
    try {
        const query = `UPDATE item SET ${updateQuery} WHERE \`Item_ID\` = ?`;

        values.push(parseInt(itemID));

        const result = await pool.query(query, values);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to update item with ID: ${itemID} ` + error.message
        );
    }
};

module.exports = {
    DB_addItem,
    DB_addItemCategories,
    DB_deleteItem,
    DB_getSellerItems,
    DB_updateItem,
    DB_deleteItemCategories,
};
