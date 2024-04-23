const express = require("express");
const {
    getAllCategories,
    getItemsByCategory,
} = require("../controllers/Item_Controller");
const router = express.Router();

router.get("/categories", getAllCategories);

router.get("/categories/:category", getItemsByCategory);
module.exports = router;
