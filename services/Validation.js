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
                .withMessage("Phone number must be 11 characters long")
        );
    }

    return validationRules;
};

module.exports = { validateRegistration };
