const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { DB_registerUser } = require("../services/User_Services");
const bcrypt = require("bcrypt");
const addCustomerInfo = require("../services/Customer_Services");

/**
 * @brief Register user
 * @route POST /users/customers/register
 * @route POST /users/sellers/register
 * @access public
 */
const registerUser = asyncHandler(async (req, res, next) => {
    //Check the validation of the user information
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Throw an error in case the user didn't provide a valid information.
        res.status(400);
        return next({ message: errors.array() });
    }

    const { username, email, password, phoneNum } = req.body;

    //Hash the password before storing it in the database.
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        username,
        email,
        hashedPassword,
        phoneNum,
    };

    let table;
    if (req.path === "/customers/register") {
        table = "customer";
    } else if (req.path === "/sellers/register") {
        table = "seller";
    }

    const result = await DB_registerUser(table, user, res);

    res.status(201).json({
        message: "Registration successful",
        data: {
            username: username,
            email: email,
        },
    });
});

const loginUser = asyncHandler(async (req, res) => {
    //1 - Make the validateLogin function to validate the user input.

    //2 - Check if the user's email exists in out database.

    //3 - Check if the password is correct.

    //4 - If the info is correct create an access token and send it the user

    res.status(200).json({ message: "Login user", user: req.body });
});

const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "Sending current user info",
        user: req.body,
    });
});

/**
 * @brief Adds a new address for a given customer
 * @route POST /users/customers/:userID/addresses
 * @access public
 */
const addCustomerAddress = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Throw an error in case the user didn't provide a valid information.
        res.status(400);
        return next({ message: errors.array() });
    }

    const userID = req.params.userID;
    const insertionTable = "customer_address";
    const { address } = req.body;

    const result = await addCustomerInfo(userID, insertionTable, address, res);

    res.status(201).json({
        message: `${insertionTable} added successfully`,
        data: {
            userID,
            address,
        },
    });
});

/**
 * @brief Adds a new card for a given customer
 * @route POST /users/customers/:userID/cards
 * @access public
 */
const addCustomerCard = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Throw an error in case the user didn't provide a valid information.
        res.status(400);
        return next({ message: errors.array() });
    }

    const userID = req.params.userID;
    const insertionTable = "customer_card";
    const { card_no } = req.body;

    const result = await addCustomerInfo(userID, insertionTable, card_no, res);

    res.status(201).json({
        message: `${insertionTable} added successfully`,
        data: {
            userID,
            card_no,
        },
    });
});

module.exports = {
    registerUser,
    loginUser,
    currentUser,
    addCustomerAddress,
    addCustomerCard,
};
