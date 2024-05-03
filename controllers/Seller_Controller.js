const asyncHandler = require("express-async-handler");
const { findUser } = require("../utils/UserUtils");
const { validationResult } = require("express-validator");
const {
    DB_addItem,
    DB_deleteItem,
    DB_updateItem,
    DB_deleteItemCategories,
    DB_addItemCategories,
} = require("../services/Item_Services");
const { DB_getSellerItems } = require("../services/Seller_Services");
const checkSellerOwnership = require("../utils/SellerUtils");

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
    const item = req.body;

    //Check if there is a seller with the specified ID
    const searchTable = "seller";
    await findUser(searchTable, sellerID, res);

    const result = await DB_addItem(item, sellerID, res);

    const itemID = result[0].insertId;
    res.status(201).json({
        message: `Item ${item.Name} created successfully`,
        data: {
            itemID,
            sellerID,
            Name: item.Name,
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
    await checkSellerOwnership(itemID, sellerID, res);

    await DB_deleteItem(itemID, res);

    res.status(200).json({
        message: `Item with id ${itemID} was deleted successfully`,
    });
});

/**
 * @brief Updates an items posted by the seller
 *
 * @route PUT /sellers/item/:Item_ID
 * @access private
 */
const updateItem = asyncHandler(async (req, res, next) => {
    const itemID = req.params.Item_ID;
    const sellerID = req.user;

    //Check that the data we got is in the right format.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        return next({ message: errors.array() });
    }

    //Check that the seller owns the item he wishes to update.
    await checkSellerOwnership(itemID, sellerID, res);

    if (req.body.hasOwnProperty("categories")) {
        const categories = req.body.categories;

        await DB_deleteItemCategories(itemID, res);

        await DB_addItemCategories(itemID, categories, res);

        delete req.body.categories;
    }

    const updateAttributes = Object.keys(req.body);
    let updateQuery = "";
    let updateValues = [];

    for (let i = 0; i < updateAttributes.length; i++) {
        updateQuery += `${updateAttributes[i]} = ?`;

        updateValues.push(req.body[updateAttributes[i]]);

        if (i < updateAttributes.length - 1) {
            updateQuery += ",";
        }
    }

    if (updateAttributes.length > 0) {
        //Update the item essential information.
        await DB_updateItem(itemID, updateQuery, updateValues);
    }

    res.status(200).json({
        message: `Updated item with ID:${itemID}`,
    });
});

module.exports = { addItem, deleteItem, getSellerItems, updateItem };
