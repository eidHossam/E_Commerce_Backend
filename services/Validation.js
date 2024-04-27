const { body } = require("express-validator");

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

module.exports = {
    validateRegistration,
    validateCard,
    validateAddress,
    validateItem,
};
