const express = require("express");
const { addItem } = require("../controllers/Seller_Controller");
const { validateItem } = require("../services/Validation");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.use(validateToken);
router.post("/item", validateItem(), addItem);

router.route("/:userID/item/:Item_ID").put().delete();

module.exports = router;
