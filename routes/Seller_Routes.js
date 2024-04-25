const express = require("express");
const {
    addItem,
    deleteItem,
    getSellerItems,
} = require("../controllers/Seller_Controller");
const { validateItem } = require("../services/Validation");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.use(validateToken);
router.route("/item").post(validateItem(), addItem).get(getSellerItems);

router.route("/item/:Item_ID").put().delete(deleteItem);

module.exports = router;
