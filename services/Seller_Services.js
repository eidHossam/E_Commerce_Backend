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

/**
 * @brief Gets the seller sales performance reports.
 *
 * @param {*} sellerID  : ID of the seller to get the performance reports for.
 * @returns             : An Array of objects with each object containing the performance of an item.
 */
const DB_getSellerReports = async (sellerID) => {
    try {
        const query =
            'SELECT order_items.Item_ID, item.Name, order_items.Price ,item.URL,\
             SUM(order_items.Price * order_items.Quantity) AS totalProfit,\
             SUM(order_items.Quantity) AS QuantitySold\
             FROM order_items, order_, item \
             WHERE order_.Status = "Completed" AND \
             order_items.Order_ID = order_.Order_ID AND order_items.Item_ID = item.Item_ID\
             AND item.I_UserID = ? \
             GROUP BY order_items.Item_ID, order_items.Price';

        const [rows, fields] = await pool.execute(query, [sellerID]);

        const report = rows.reduce((acc, row) => {
            const itemIndex = acc.findIndex(
                (accItem) => row.Item_ID === accItem.Item_ID
            );

            if (itemIndex === -1) {
                acc.push({
                    Item_ID: row.Item_ID,
                    Name: row.Name,
                    URL: row.URL,
                    TotalProfit: parseInt(row.totalProfit),
                    TotalQuantity: parseInt(row.QuantitySold),
                    prices: [
                        {
                            Price: row.Price,
                            Profit: parseInt(row.totalProfit),
                            Quantity: parseInt(row.QuantitySold),
                        },
                    ],
                });
            } else {
                acc[itemIndex].TotalProfit += parseInt(row.totalProfit);
                acc[itemIndex].TotalQuantity += parseInt(row.QuantitySold);
                acc[itemIndex].prices.push({
                    Price: row.Price,
                    Profit: parseInt(row.totalProfit),
                    Quantity: parseInt(row.QuantitySold),
                });
            }

            return acc;
        }, []);

        return report;
    } catch (error) {
        throw new Error(
            `Failed to get the seller ${sellerID} reports, ${error.message}`
        );
    }
};

module.exports = {
    DB_getSellerItems,
    DB_getSellerReports,
};
