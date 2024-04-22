const asyncHandler = require("express-async-handler");
const { findUser } = require("../utils/UserUtils");
const { DB_addItem } = require("../services/Item_Services");
const { validationResult } = require("express-validator");

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
    const { name, description, price, quantity, url } = req.body;

    //Check if there is a seller with the specified ID
    const searchTable = "seller";
    await findUser(searchTable, sellerID, res);

    const item = {
        name,
        description,
        price,
        quantity,
        url,
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

module.exports = { addItem };
