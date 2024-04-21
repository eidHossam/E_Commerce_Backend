const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { DB_registerUser } = require("../services/User_Services");
const bcrypt = require("bcrypt");

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

module.exports = { registerUser, loginUser, currentUser };
