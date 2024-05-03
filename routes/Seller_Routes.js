const express = require("express");
const {
    addItem,
    deleteItem,
    getSellerItems,
    updateItem,
} = require("../controllers/Seller_Controller");
const { validateItem } = require("../middleware/Validation");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.use(validateToken);

router.route("/item").post(validateItem("add", 1), addItem).get(getSellerItems);

router
    .route("/item/:Item_ID")
    .put(validateItem("update", 0), updateItem)
    .delete(deleteItem);

module.exports = router;
