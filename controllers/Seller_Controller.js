const asyncHandler = require("express-async-handler");
const { findUser } = require("../utils/UserUtils");
const { validationResult } = require("express-validator");
const {
    DB_addItem,
    DB_deleteItem,
    DB_getSellerItems,
} = require("../services/Seller_Services");
const { DB_getItemByID } = require("../services/Item_Services");

/**
 * @brief Adds a new item in the system.
 * @route POST /sellers/item
 * @access private
 */
const addItem = asyncHandler(async (req, res, next) => {
    //Check the validation of the user information
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Throw an error in case the user didn't provide a valid information.
        res.status(400);
        return next({ message: errors.array() });
    }

    const sellerID = req.user;
    const { name, description, price, quantity, url, categories } = req.body;

    //Check if there is a seller with the specified ID
    const searchTable = "seller";
    await findUser(searchTable, sellerID, res);

    const item = {
        name,
        description,
        price,
        quantity,
        url,
        categories,
    };
    const result = await DB_addItem(item, sellerID, res);

    const itemID = result[0].insertId;
    res.status(201).json({
        message: `Item ${name} created successfully`,
        data: {
            itemID,
            sellerID,
            name,
        },
    });
});

/**
 * @brief Retrieves all the items associated with the given seller
 * @route GET /sellers/item
 * @access private
 */
const getSellerItems = asyncHandler(async (req, res, next) => {
    const sellerID = req.user;
    const sellerItems = await DB_getSellerItems(sellerID, res);

    res.status(200).json({
        message: `Getting all items for seller with id ${sellerID}`,
        items: sellerItems[0],
    });
});

/**
 * @brief Deletes an items posted by the seller
 * @route DELETE /sellers/item/:Item_ID
 * @access private
 */
const deleteItem = asyncHandler(async (req, res, next) => {
    const itemID = req.params.Item_ID;
    const sellerID = req.user;

    const itemSearchResult = await DB_getItemByID(itemID, res);

    if (itemSearchResult[0].length === 0) {
        res.status(404);
        throw new Error(`Could not find item with id ${itemID}`);
    }

    if (itemSearchResult[0][0].I_UserID !== sellerID) {
        res.status(401);
        throw new Error(`unathorized access to item with id ${itemID}`);
    }

    await DB_deleteItem(itemID, res);

    res.status(200).json({
        message: `Item with id ${itemID} was deleted successfully`,
    });
});

module.exports = { addItem, deleteItem, getSellerItems };
