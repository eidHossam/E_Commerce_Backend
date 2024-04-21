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
        body("email")
            .isEmail()
            .withMessage("Email must be valid")
            .isLength({
                max: process.env.EMAIL_MAX_LENGTH,
            })
            .normalizeEmail(),
        body("password")
            .isLength({
                min: process.env.PASSWORD_MIN_LENGTH,
                max: process.env.PASSWORD_MAX_LENGTH,
            })
            .withMessage("Password cannot be empty")
            .escape(),
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
module.exports = { validateRegistration, validateCard, validateAddress };
