const { DB_getItemByID } = require("../services/Item_Services");

const checkSellerOwnership = async (itemID, sellerID, res) => {
    try {
        const itemSearchResult = await DB_getItemByID(itemID, res);

        if (itemSearchResult[0].length === 0) {
            res.status(404);
            throw new Error(`Could not find item with id ${itemID}`);
        }

        if (itemSearchResult[0][0].I_UserID !== sellerID) {
            res.status(401);
            throw new Error(`unathorized access to item with id ${itemID}`);
        }
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = checkSellerOwnership;
