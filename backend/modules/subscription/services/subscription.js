const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const moment = require("moment/moment");
const { getAllModels } = require("../../../middlewares/loadModels");

const filterAllowedFields = (requestBody, allowedFields) => {
  if (typeof requestBody !== "object" || requestBody === null || Array.isArray(requestBody)) {
    throw { message: "Invalid request body" };
  }

  const filtered = Object.keys(requestBody)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = requestBody[key];
      return obj;
    }, {});

  if (Object.keys(filtered).length === 0) {
    throw { message: "No valid fields to process" };
  }

  return filtered;
};

const getPlan = async (where) => {
  if (typeof where !== "object") {
    throw { message: "Invalid where condition" };
  }

  const allModels = await getAllModels(process.env.DB_TYPE);
  const { Plan } = allModels;

  if (where.id) {
    return await Plan.findOne({ where });
  }
  return await Plan.findAll();
};

const updatePlan = async (requestBody, where) => {
  if (!where) {
    throw { message: "Invalid where condition" };
  }

  const { Plan } = await getAllModels(process.env.DB_TYPE);
  delete requestBody.id;

  const allowedFields = ['name', 'price', 'interval', 'features'];
  const filteredRequestBody = filterAllowedFields(requestBody, allowedFields);

  return await Plan.update(filteredRequestBody, { where });
};

const addPlan = async (requestBody) => {
  const { Plan } = await getAllModels(process.env.DB_TYPE);
  const allowedFields = ['name', 'price', 'interval', 'features','stripe_price_id'];
  const filteredRequestBody = filterAllowedFields(requestBody, allowedFields);

  return await Plan.create(filteredRequestBody);
};

const createSubscriptions = async (user_id, plan_id, payment_method_id) => {
  try {
    console.log("createSubscriptions called with:", { user_id, plan_id, payment_method_id });

    if (!user_id || !plan_id) {
      throw new Error("User ID and Plan ID are required.");
    }

    if (!payment_method_id || typeof payment_method_id !== 'string') {
      throw new Error("Payment method ID must be a non-empty string.");
    }

    const { Users, Plan, Usersubscriptions } = await getAllModels(process.env.DB_TYPE);

    const user = await Users.findOne({ where: { id: user_id } });
    if (!user) throw new Error("User not found");

    const plan = await Plan.findOne({ where: { id: plan_id } });
    if (!plan) throw new Error("Plan not found");
    if (!plan.stripe_price_id) throw new Error("Plan is missing Stripe price ID");

    let stripeCustomerId = user.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName || "",
      });
      stripeCustomerId = customer.id;
      await user.update({ stripe_customer_id: stripeCustomerId });
    }

    await stripe.paymentMethods.attach(payment_method_id, { customer: stripeCustomerId });

    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: payment_method_id },
    });

    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: plan.stripe_price_id }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice', 'latest_invoice.payment_intent', 'pending_setup_intent'],
    });

    const latestInvoice = stripeSubscription.latest_invoice;
    const clientSecret = latestInvoice?.payment_intent?.client_secret || null;

   
    const startDate = new Date();
    let endDate;
    if (plan.interval === 'monthly') {
      endDate = moment(startDate).add(1, 'month').toDate();
    } else if (plan.interval === 'yearly') {
      endDate = moment(startDate).add(1, 'year').toDate();
    } else {
      throw new Error("Invalid or missing plan duration.");
    }

    const subscriptionData = {
      user_id,
      plan_id,
      stripe_subscription_id: stripeSubscription.id,
      status: clientSecret ? "pending" : "active",
      started_at: startDate,
      ended_at: endDate,
    };

    const newSubscription = await Usersubscriptions.create(subscriptionData, {
      returning: true,
    });

    return {
      message: "Subscription created successfully",
      subscription: newSubscription,
      client_secret: clientSecret,
    };

  } catch (error) {
    console.error("Detailed subscription creation error:", {
      message: error.message,
      stack: error.stack,
      raw: error,
    });

    if (error.type?.includes("Stripe")) {
      throw new Error(`Payment processing error: ${error.message}`);
    }

    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};




const cancelSubscription = async (subscription_id) => {
  console.log("cancelSubscription called with subscription_id:", subscription_id);

  const { Usersubscriptions } = await getAllModels(process.env.DB_TYPE);
  console.log("Models loaded, Usersubscriptions:", !!Usersubscriptions);

  const subscription = await Usersubscriptions.findOne({ where: { id: subscription_id } });
  console.log("Fetched subscription:", subscription);

  if (!subscription || !subscription.stripe_subscription_id) {
    console.error("Subscription not found or not linked with Stripe");
    throw new Error("Subscription not found or not linked with Stripe" );
  }

  console.log("Stripe subscription ID:", subscription.stripe_subscription_id);

  try {
    const stripeCancelResponse = await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    console.log("Stripe subscription cancel response:", stripeCancelResponse);
  } catch (error) {
    console.error("Error cancelling Stripe subscription:", error);
    throw error;
  }

  try {
    const cancelResponse = await subscription.update({ status: 'canceled' }); 
    console.log("Subscription status updated to 'canceled':", cancelResponse);
  } catch (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }

  console.log("Subscription cancellation process completed successfully");
  return { message: "Subscription cancelled successfully" };
};

const getUserSubscription = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const allModels = await getAllModels(process.env.DB_TYPE);
  const { Usersubscriptions, Plan} = allModels;

  const subscription = await Usersubscriptions.findOne({
  where: { user_id: userId },
  include: [
    {
      model: Plan,
      as: "plan", 
      attributes: ['name', 'price'], 
    },
  ],
  });
 

  if (!subscription) {
    throw new Error("No active subscription found.");
  }

  return subscription;
};

const updateSubscriptionPlan = async (subscription_id, new_plan_id) => {
  const { Usersubscriptions, Plan } = await getAllModels(process.env.DB_TYPE);

  
  const subscription = await Usersubscriptions.findOne({
  where: { stripe_subscription_id: subscription_id } 
});
  if (!subscription) {
    throw new Error("Subscription not found");
  }

  if (!subscription.stripe_subscription_id) {
    throw new Error("Stripe subscription ID not found in subscription record");
  }

  const newPlan = await Plan.findOne({ where: { id: new_plan_id } });
  if (!newPlan) {
    throw new Error("New plan not found");
  }

  if (!newPlan.stripe_price_id) {
    throw new Error("New plan is missing Stripe price ID");
  }

 
  const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
  const itemId = stripeSubscription.items?.data?.[0]?.id;

  if (!itemId) {
    throw new Error("Stripe subscription item ID not found");
  }

  
  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: false,
    proration_behavior: 'create_prorations',
    items: [{
      id: itemId,
      price: newPlan.stripe_price_id,
    }],
  });

  await subscription.update({ plan_id: new_plan_id });

  return { message: "Subscription plan updated successfully" };
};

const createPayments = async (requestBody) => {
  const { Payments } = await getAllModels(process.env.DB_TYPE);

  return await Payments.create({
    ...requestBody,
    payment_date: new Date(),
    status: 'succeeded'
  });
};

const listPayments = async () => {
  const { Payments } = await getAllModels(process.env.DB_TYPE);
  return await Payments.findAll({
    order: [['payment_date', 'DESC']]
  });
};

module.exports = {
  getPlan,
  updatePlan,
  addPlan,
  createSubscriptions,
  cancelSubscription,
  updateSubscriptionPlan,
  createPayments,
  getUserSubscription,
  listPayments,
  
};
