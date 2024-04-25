const pool = require("../config/DB_Connection");

const DB_addItem = async (item, sellerID, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        query =
            "INSERT INTO `item` (`Name`, `Description`, `Price`, `Quantity`, `URL`, `I_UserID`)\
             VALUES (?, ?, ?, ?, ?, ?)";

        const result = await connection.query(query, [
            item.name,
            item.description,
            item.price,
            item.quantity,
            item.url,
            sellerID,
        ]);

        const itemID = result[0].insertId;

        await DB_addItemCategories(itemID, item.categories);

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

const DB_addItemCategories = async (itemID, categories) => {
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
        throw new Error(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const DB_deleteItem = async (itemID, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        query = "DELETE FROM item WHERE Item_ID = ?";

        const result = await connection.query(query, [itemID]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to delete item with ID: ${itemID}` + error.message
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const DB_getSellerItems = async (sellerID, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        query =
            "SELECT item.*,\
        (SELECT GROUP_CONCAT(category.Name) FROM item_category INNER JOIN category ON \
        item_category.Category_ID = category.Category_ID WHERE item_category.Item_ID = item.Item_ID) \
        AS categories FROM item JOIN item_category ON item_category.Item_ID = item.Item_ID \
        JOIN category ON category.Category_ID = item_category.Category_ID \
        WHERE item.I_UserID = ? GROUP BY item.Item_ID";

        const result = await connection.query(query, [sellerID]);

        return result;
    } catch (error) {
        res.status(500);
        throw new Error(
            `Failed to find items for seller with ID: ${sellerID}` +
                error.message
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = { DB_addItem, DB_deleteItem, DB_getSellerItems };
