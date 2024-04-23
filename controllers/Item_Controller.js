const asyncHandler = require("express-async-handler");
const {
    DB_getCategories,
    DB_getItemByCategory,
} = require("../services/Item_Services");

/**
 * @brief Retrieves all the categories of the items in the database.
 * @route GET /items/categories
 * @access public
 */
const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await DB_getCategories();

    // Use map to extract the values of the "Category" key from each object
    const categoriesArray = categories[0].map((obj) => obj.Category);
    res.status(200).json({
        message: "Sending all categories",
        categories: categoriesArray,
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
        items: items[0],
    });
});
module.exports = { getAllCategories, getItemsByCategory };
