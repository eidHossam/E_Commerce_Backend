const {
    orderAddItem,
    orderDeleteItem,
    deleteOrder,
} = require("../controllers/Customer_Controller");
const validateToken = require("../middleware/validateTokenHandler");

router = require("express").Router();

//Use the token authenticator middleware as these are private endpoints
router.use(validateToken);

router
    .route("/orders")
    .post(orderAddItem)
    .get()
    .put(orderAddItem)
    .delete(deleteOrder);

router.delete("/orders/:Item_ID", orderDeleteItem);

module.exports = router;
