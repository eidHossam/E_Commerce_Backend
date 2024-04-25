const express = require("express");
const {
    loginUser,
    currentUser,
    registerUser,
    addCustomerAddress,
    addCustomerCard,
} = require("../controllers/Users_Controller");
const {
    validateRegistration,
    validateCard,
    validateAddress,
} = require("../services/Validation");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post(
    "/customers/register",
    validateRegistration("customer"),
    registerUser
);

router.post(
    "/customers/addresses",
    validateToken,
    validateAddress(),
    addCustomerAddress
);

router.post("/customers/cards", validateToken, validateCard(), addCustomerCard);

router.post("/sellers/register", validateRegistration("seller"), registerUser);

router.post("/login", loginUser);

router.get("/current/:userType", validateToken, currentUser);

module.exports = router;
