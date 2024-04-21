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
const router = express.Router();

router.post(
    "/customers/register",
    validateRegistration("customer"),
    registerUser
);

router.post(
    "/customers/:userID/addresses",
    validateAddress(),
    addCustomerAddress
);

router.post("/customers/:userID/cards", validateCard(), addCustomerCard);

router.post("/sellers/register", validateRegistration("seller"), registerUser);

router.post("/login", loginUser);

router.get("/current", currentUser);

module.exports = router;
