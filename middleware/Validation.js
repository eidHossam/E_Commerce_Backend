const { body } = require("express-validator");
const { DB_getItemByID } = require("../services/Item_Services");
const asyncHandler = require("express-async-handler");

const validateRegistration = (userType) => {
    const validationRules = [
        body("username")
            .trim()
            .isLength({
                min: process.env.USERNAME_MIN_LENGTH,
                max: process.env.USERNAME_MAX_LENGTH,
            })
            .withMessage("Username cannot be empty")
            .escape(),
        body("userID")
            .isLength({
                min: process.env.USERID_MIN_LENGTH,
                max: process.env.USERID_MAX_LENGTH,
            })
            .withMessage("userID cannot be empty"),
    ];

    if (userType === "customer") {
        validationRules.push(
            body("phoneNum")
                .isLength({
                    min: process.env.PHONE_NUMBER_MIN_LENGTH,
                    max: process.env.PHONE_NUMBER_MAX_LENGTH,
                })
                .withMessage(
                    `Phone number must be ${process.env.PHONE_NUMBER_MAX_LENGTH} characters long`
                )
        );
    }

    return validationRules;
};

const validateCard = () => {
    return [
        body("card_no")
            .isLength({ min: 16, max: 16 })
            .withMessage("Card number must be 16 digits long"),
    ];
};

const validateAddress = () => {
    return [
        body("address")
            .isLength({
                min: process.env.ADDRESS_MIN_LENGTH,
                max: process.env.ADDRESS_MAX_LENGTH,
            })
            .withMessage(
                `Address must be between ${process.env.ADDRESS_MIN_LENGTH} and ${process.env.ADDRESS_MAX_LENGTH}`
            ),
    ];
};

const validateItem = (operation, minLength) => {
    const validationRules = [
        body("Name")
            .isLength({
                min: minLength,
                max: process.env.ITEM_NAME_MAX_LENGTH,
            })
            .withMessage(
                `An item name must be provided and be shorter than ${process.env.ITEM_NAME_MAX_LENGTH} characters`
            ),
        body("Description")
            .isLength({ max: process.env.ITEM_DESCRIPTION_MAX_LENGTH })
            .withMessage(
                `Item description must be shorter than ${process.env.ITEM_DESCRIPTION_MAX_LENGTH} characters`
            ),
        body("URL")
            .isLength({ min: minLength, max: process.env.ITEM_URL_MAX_LENGTH })
            .withMessage(
                `url must be provided and be shorter than ${process.env.ITEM_URL_MAX_LENGTH}`
            ),
    ];

    if (operation === "add") {
        validationRules.push(
            body("Price")
                .isInt({ min: minLength, max: Number.MAX_SAFE_INTEGER })
                .withMessage(
                    `price must be between ${minLength} and ${Number.MAX_SAFE_INTEGER}`
                ),
            body("Quantity")
                .isInt({ min: minLength, max: Number.MAX_SAFE_INTEGER })
                .withMessage(
                    `quantity must be between ${minLength} and ${Number.MAX_SAFE_INTEGER}`
                )
        );
    } else {
        validationRules.push(
            body("Price")
                .isInt({ min: minLength, max: Number.MAX_SAFE_INTEGER })
                .withMessage(
                    `price must be between ${minLength} and ${Number.MAX_SAFE_INTEGER}`
                )
                .optional(),
            body("Quantity")
                .isInt({ min: minLength, max: Number.MAX_SAFE_INTEGER })
                .withMessage(
                    `quantity must be between ${minLength} and ${Number.MAX_SAFE_INTEGER}`
                )
                .optional()
        );
    }

    return validationRules;
};

/**
 * @brief Checks if the provided date is in the future
 *
 * @param {*} month : Month of the year.
 * @param {*} year  : The last 2 digits of the year.
 */
const isFutureDate = (value, { req }) => {
    const currentDate = new Date();
    const { expMonth, expYear } = req.body;

    const century = new Date().getFullYear().toString().substring(0, 2);
    const fullYear = `${century}${expYear}`;

    const expirationDate = new Date(fullYear, expMonth - 1);

    if (expirationDate < currentDate) {
        throw new Error("Expiration date must be in the future");
    }

    return true;
};

/**
 * @brief validates the expiration date to be in the future.
 *
 * @returns An array holding the errors if any.
 */
const validateTransaction = () => {
    const currentYear = new Date().getFullYear().toString().substring(2, 5);
    return [
        body("amount")
            .isInt({ min: 1 })
            .withMessage("amount must be greater than zero"),
        body("cardNumber")
            .isLength({ min: 16, max: 16 })
            .withMessage("Card number must be 16 digits long"),
        body("expMonth")
            .isInt({ min: 1, max: 12 })
            .withMessage("Invalid expiration month"),
        body("expYear")
            .isInt({ min: currentYear })
            .withMessage("Invalid expiration year"),
        body("cvc")
            .isLength({ min: 3, max: 3 })
            .withMessage("CVC must be 3 digits long"),

        body().custom(isFutureDate),
    ];
};

/**
 *@brief Checks if the item exists in out system and if the quantity requested is available.
 *
 * @param {*} req     : Request object.
 * @param {*} res     : Response object.
 */
const validateOrderItem = asyncHandler(async (req, res, next) => {
    try {
        const { Item_ID, Quantity } = req.body;

        //Check if the item exists
        const item = await DB_getItemByID(Item_ID);

        if (!item) {
            res.status(404);
            throw new Error(`Item ${Item_ID} not found.`);
        }

        //Check if the requested quantity of the item is more than what is available.
        if (Quantity > item.Quantity) {
            res.status(400);
            throw new Error(
                `The requested quantity is not available only ${item.Quantity} in stock.`
            );
        }

        req.itemPrice = item.Price;

        next();
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    validateRegistration,
    validateCard,
    validateAddress,
    validateItem,
    validateTransaction,
    validateOrderItem,
};
