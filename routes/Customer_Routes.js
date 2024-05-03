const {
    orderAddItem,
    orderDeleteItem,
    deleteOrder,
    getOrder,
    chargeBalance,
    checkoutByBalance,
    customerPurchaseHistory,
} = require("../controllers/Customer_Controller");
const validateToken = require("../middleware/validateTokenHandler");
const {
    validateTransaction,
    validateOrderItem,
} = require("../middleware/Validation");

router = require("express").Router();

//Use the token authenticator middleware as these are private endpoints
router.use(validateToken);

router
    .route("/orders")
    .post(validateOrderItem, orderAddItem)
    .get(getOrder)
    .put(validateOrderItem, orderAddItem)
    .delete(deleteOrder);

router.delete("/orders/:Item_ID", orderDeleteItem);

router.put("/balance", validateTransaction(), chargeBalance);

router.post("/orders/checkout/balance", checkoutByBalance);

router.get("/history", customerPurchaseHistory);
module.exports = router;
