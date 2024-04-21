const express = require("express");
const {
    loginUser,
    currentUser,
    registerUser,
} = require("../controllers/Users_Controller");
const { validateRegistration } = require("../services/Validation");
const router = express.Router();

router.post(
    "/customers/register",
    validateRegistration("customer"),
    registerUser
);

router.post("/sellers/register", validateRegistration("seller"), registerUser);

router.post("/login", loginUser);

router.get("/current", currentUser);

module.exports = router;
