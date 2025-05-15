 // Content for subscriptions.js

const subscriptionServices = require("../services/subscription");
const { sendResponse } = require("../utils/helper");


exports.getPlan = async (req, res) => {
    const { id } = req.params;
    const subscriptions = await subscriptionServices.getPlan({ id });
    return sendResponse(res, 200, true, "Subscripton deatils successfully", subscriptions);
};

exports.updatePlan = async (req, res) => {
    const { id } = req.body;
    const subscriptions = await subscriptionServices.updatePlan(req.body, {
        id,
    });
    return sendResponse(res, 200, true, "Plan Updated successfully", subscriptions);
};

exports.addPlan = async (req, res) => {
    const subscriptions = await subscriptionServices.addPlan(req.body);
    return sendResponse(res, 200, true, "Plan added successfully", subscriptions);
};
exports.createSubscriptions = async (req, res, next) => {
  
  try {
    const user_id = req.user.id; 
    const { plan_id, payment_method_id } = req.body;
    const result = await subscriptionServices.createSubscriptions(user_id, plan_id, payment_method_id); 

    return sendResponse(res, 201, true, "Subscription created successfully", result);
  } catch (error) {
    return next(error);
  }
};


exports.getUserSubscription = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const subscription = await subscriptionServices.getUserSubscription({ userId });

    return res.status(200).json({
      success: true,
      message: "User subscription retrieved successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Error in subscription manager:", error);
    return next(error);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const { subscription_id } = req.params;
   
    const result = await subscriptionServices.cancelSubscription(subscription_id);
    return sendResponse(res, 200, true, "Subscription cancelled successfully", result);
  } catch (error) {
    return next(error);
  }
};

exports.updateSubscriptionPlan = async (req, res, next) => {
  try {
    const { id: subscription_id } = req.params;
    const { new_plan_id } = req.body;
    // const user_id = req.user_id;

    const result = await subscriptionServices.updateSubscriptionPlan(subscription_id, new_plan_id);
    console.log(result); 
    return sendResponse(res, 200, true, "Subscription updated successfully", result);
  } catch (error) {
    return next(error);
  }
};


exports.createPayments = async(req,res) =>{
    const subscriptions = await subscriptionServices.createPayments(req.body);
    return sendResponse(res, 200, true,"Payments Created successfully",subscriptions);
};

exports.listPayments = async (req,res) =>{
    const subscriptions = await subscriptionServices.listPayments();
    return sendResponse(res,200,true,"Payments fetched successfully", subscriptions);

};


