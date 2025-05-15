 // Content for subscriptions.js 

const express = require("express");
const subscriptionController = require("../controller/subscription");
const {
  authenticate,
 
} = require("../../../middlewares/authenticate");

const router = express.Router();

router.put(
    "/update",
    subscriptionController.updatePlan
);

router.get("/plan", subscriptionController.getPlan);

router.post("/add", subscriptionController.addPlan);

router.put(
  "/update/usersubscription/:id",
  authenticate,

  subscriptionController.updateSubscriptionPlan
);
router.delete(
  "/cancel/:subscription_id",  
  authenticate, 
  subscriptionController.cancelSubscription  
);

router.post("/create", authenticate,  subscriptionController.createSubscriptions);

router.get("/user", authenticate, subscriptionController.getUserSubscription);


router.get('/payments', subscriptionController.listPayments); 


router.post('/payments', subscriptionController.createPayments);




module.exports = router;
