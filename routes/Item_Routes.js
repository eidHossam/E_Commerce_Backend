const express = require("express");
const {
    getAllCategories,
    getItemsByCategory,
    getItemsByName,
} = require("../controllers/Item_Controller");
const router = express.Router();

router.get("/categories", getAllCategories);

router.get("/categories/:category", getItemsByCategory);

router.get("/:itemName", getItemsByName);
module.exports = router;
