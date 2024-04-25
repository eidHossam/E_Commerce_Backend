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

const DB_getItemByName = async (itemName, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
    } catch (error) {
    } finally {
    }
};
module.exports = { DB_addItem, DB_getCategories, DB_getItemByCategory };
