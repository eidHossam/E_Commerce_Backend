const pool = require("../config/DB_Connection");

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

module.exports = {
    DB_getSellerItems,
};
