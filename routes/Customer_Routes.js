const { orderAddItem } = require("../controllers/Customer_Controller");
const validateToken = require("../middleware/validateTokenHandler");

router = require("express").Router();

//Use the token authenticator middleware as these are private endpoints
router.use(validateToken);

router.route("/orders").post(orderAddItem).get().put(orderAddItem);

router.delete("/orders/?itemID");

module.exports = router;
