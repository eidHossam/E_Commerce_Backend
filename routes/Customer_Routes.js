const {
    orderAddItem,
    orderDeleteItem,
    deleteOrder,
    getOrder,
    chargeBalance,
} = require("../controllers/Customer_Controller");
const validateToken = require("../middleware/validateTokenHandler");
const { validateTransaction } = require("../services/Validation");

router = require("express").Router();

//Use the token authenticator middleware as these are private endpoints
router.use(validateToken);

router
    .route("/orders")
    .post(orderAddItem)
    .get(getOrder)
    .put(orderAddItem)
    .delete(deleteOrder);

router.delete("/orders/:Item_ID", orderDeleteItem);

router.put("/balance", validateTransaction(), chargeBalance);
module.exports = router;
