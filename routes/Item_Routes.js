const express = require("express");
const { getAllCategories } = require("../controllers/Item_Controller");
const router = express.Router();

router.get("/categories", getAllCategories);

module.exports = router;
