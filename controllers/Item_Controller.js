const asyncHandler = require("express-async-handler");
const { DB_getCategories } = require("../services/Item_Services");

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

module.exports = { getAllCategories };
