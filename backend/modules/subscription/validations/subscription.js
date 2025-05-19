

//validations/plans

exports.addPlanInput = [
    { key: "name", type: "string", required: true },
    { key: "price", type: "number", required: true },
    { key: "interval", type: "string", values: ["monthly", "yearly","weekly"], required: true },
    { key: "features", type: "object", required: false },
    { key: "created_at", type: "date", required: false },
    { key: "stripe_price_id", type: "string", required: true }, 
];


exports.updatePlanInput = [
    { key: "id", type: "string", required: true },
    { key: "name", type: "string", required: false },
    { key: "price", type: "number", required: false },
    { key: "interval", type: "string", values: ["monthly", "yearly"], required: false },
    { key: "features", type: "object", required: false },
];



exports.getPlanInput = [
    { key: "id", type: "number", required: false },
];


exports.createSubscriptionInput = [
  // { key: "user_id", type: "string", required: true },
  { key: "plan_id", type: "string", required: true },
  {key: "payment_method_id", type:"string",required:false}
];

exports.cancelSubscriptionInput = [
  { key: "subscription_id", type: "string", required: true }
];


exports.getUserSubscriptionInput = [
  { key: "userId", type: "string", required: true },
];

exports.updateSubscriptionInput = [
  { key: "new_plan_id", type: "string", required: true }
];











//validations/paymentstable

exports.createPaymentsInput = [
  // { key: "id", type: "string", required: true },
  { key: "subscription_id", type: "string", required: true },
  { key: "amount", type: "number", required: true },
  { key: "status", type: "string", required: true, values: ["paid", "failed", "pending"] },
  { key: "payment_date", type: "date", required: true }
];




