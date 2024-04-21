const express = require("express");
const {
    registerUser,
    loginUser,
    currentUser,
} = require("../controllers/Users_Controller");
const { validateRegistration } = require("../services/Validation");
const router = express.Router();

router.post("/registration", validateRegistration(), registerUser);

router.post("/login", loginUser);

router.get("/current", currentUser);

module.exports = router;
