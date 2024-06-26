const asyncHandler = require("express-async-handler");
const {
    DB_getCategories,
    DB_getItemByCategory,
    DB_getItemByName,
} = require("../services/Item_Services");

/**
 * @brief Retrieves all the categories of the items in the database.
 * @route GET /items/categories
 * @access public
 */
const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await DB_getCategories();

    // Use map to extract the values of the "Category" key from each object
    res.status(200).json({
        message: "Sending all categories",
        categories,
    });
});

/**
 * @brief Retrieves all the items associated with a certain category.
 * @route GET /items/categories/:category
 * @access public
 */
const getItemsByCategory = asyncHandler(async (req, res, next) => {
    const category = req.params.category;
    const items = await DB_getItemByCategory(category);

    res.status(200).json({
        message: `Getting all items by category ${category}`,
        items,
    });
});

/**
 * @brief Retrieves all the items associated with a certain name.
 * @route GET /items/:itemName
 * @access public
 */
const getItemsByName = asyncHandler(async (req, res, next) => {
    const itemName = req.params.itemName;

    if (!itemName) {
        res.status(404);
        throw new Error("Item name must be provided");
    }

    const items = await DB_getItemByName(itemName);

    res.status(200).json({
        message: `Getting all items by name: ${itemName}`,
        items,
    });
});
module.exports = { getAllCategories, getItemsByCategory, getItemsByName };
