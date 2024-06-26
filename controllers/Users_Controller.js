const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { DB_registerUser, DB_searchUser } = require("../services/User_Services");
const {
    addCustomerInfo,
    DB_getCustomerAddress,
    DB_getCustomerCard,
} = require("../services/Customer_Services");
const jwt = require("jsonwebtoken");
const { findUser } = require("../utils/UserUtils");

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

    const { userID, username, phoneNum } = req.body;

    const user = {
        userID,
        username,
        phoneNum,
    };

    let table;
    if (req.path === "/customers/register") {
        table = "customer";
    } else if (req.path === "/sellers/register") {
        table = "seller";
    }

    const result = await DB_registerUser(table, user, res);

    const accessToken = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "100y",
    });

    res.status(201).json({
        message: `${table} registration successful`,
        data: {
            accessToken,
            username,
        },
    });
});

/**
 * @brief Login user
 * @route POST api/users/login
 * @access public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        res.status(400);
        throw new Error("User ID is required");
    }

    //2 - Check if the user's email exists in out database.
    let searchTable = "customer";
    const custSearchResult = await DB_searchUser(searchTable, userID, res);

    //check if the user is a customer.
    if (custSearchResult[0].length !== 0) {
        const accessToken = jwt.sign(
            { userID: custSearchResult[0][0].User_ID },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "100y",
            }
        );
        return res.status(200).json({
            message: "Login successful",
            data: {
                accessToken,
                userType: "customer",
                Username: custSearchResult[0][0].Username,
                Balance: custSearchResult[0][0].Balance,
                Phone_no: custSearchResult[0][0].Phone_no,
            },
        });
    }

    searchTable = "seller";
    const sellerSearchResult = await DB_searchUser(searchTable, userID, res);

    //check if the user is a seller.
    if (sellerSearchResult[0].length !== 0) {
        const accessToken = jwt.sign(
            { userID: sellerSearchResult[0][0].User_ID },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "100y",
            }
        );
        return res.status(200).json({
            message: "Login successful",
            data: {
                accessToken,
                userType: "seller",
                Username: sellerSearchResult[0][0].Username,
                Balance: sellerSearchResult[0][0].Balance,
                Phone_no: sellerSearchResult[0][0].Phone_no,
            },
        });
    }

    res.status(404);
    throw new Error("User not found");
});

/**
 * @brief Returns the current user information
 * @route GET users/current/:userType
 * @access private
 */
const currentUser = asyncHandler(async (req, res) => {
    const userType = req.params.userType;
    const userID = req.user;
    const user = await findUser(userType, userID, res);

    if (userType === "customer") {
        const address = await DB_getCustomerAddress(userID, res);
        const addresses = address[0].map((obj) => {
            return obj.Address;
        });
        user[0].addresses = addresses;

        const card = await DB_getCustomerCard(userID, res);
        const cards = card[0].map((obj) => {
            return obj.Card_no;
        });
        user[0].cards = cards;
    }
    res.status(200).json({
        message: "Sending current user info",
        user: user[0],
    });
});

/**
 * @brief Adds a new address for a given customer
 * @route POST /users/customers/addresses
 * @access private
 */
const addCustomerAddress = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Throw an error in case the user didn't provide a valid information.
        res.status(400);
        return next({ message: errors.array() });
    }

    const userID = req.user;
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
 * @access private
 */
const addCustomerCard = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Throw an error in case the user didn't provide a valid information.
        res.status(400);
        return next({ message: errors.array() });
    }

    const userID = req.user;
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
