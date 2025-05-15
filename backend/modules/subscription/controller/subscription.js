const {
    getPlanInput,
    updatePlanInput,
    addPlanInput,
    createSubscriptionInput,
    updateSubscriptionInput,
    createPaymentsInput,
    getUserSubscriptionInput

} = require("../validations/subscription");
const { buildSchema } = require("../../../middlewares/joiValidations");
const subscriptionManager = require("../manager/subscription");
const { supportedDbTypes } = require("../utils/staticData");
const { unsupportedDBType } = require("../utils/messages");
const CustomError = require("../../../middlewares/customError");


exports.getPlan = async (req, res, next) => {

    try {
        if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
            return next(new CustomError(unsupportedDBType, 400));
        }
        const schema = buildSchema(getPlanInput);

        const { error } = schema.validate(req.params);
        if (error) return next(new CustomError(error.details[0].message, 400));
        const result = await subscriptionManager.getPlan(req, res, next);
        return result;

    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
}

exports.updatePlan = async (req, res, next) => {
    try {
        if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
            return next(new CustomError(unsupportedDBType, 400));
        }
        const schema = buildSchema(updatePlanInput);

        const { error } = schema.validate(req.body);
        if (error) return next(new CustomError(error.details[0].message, 400));

        const result = await subscriptionManager.updatePlan(req, res, next);
        return result;
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
}

exports.addPlan = async (req, res, next) => {
    try {
        if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
            return next(new CustomError(unsupportedDBType, 400));
        }
        const schema = buildSchema(addPlanInput);
        const { error } = schema.validate(req.body);
        if (error)

            return next(new CustomError(error.details[0].message, 400));

        const result = await subscriptionManager.addPlan(req, res);
        return result;
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
};



exports.createSubscriptions = async (req, res, next) => {

    try {
        if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
            return next(new CustomError(unsupportedDBType, 400))
        }
        const schema = buildSchema(createSubscriptionInput);

        const { error } = schema.validate(req.body);

        if (error) return next(new CustomError(error.details[0].message, 400));
        const result = await subscriptionManager.createSubscriptions(req, res, next);

        return result;
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }

};




exports.getUserSubscription = async (req, res, next) => {
  try {
    if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
      return next(new CustomError(unsupportedDBType, 400));
    }

    const schema = buildSchema(getUserSubscriptionInput);
    const { error } = schema.validate({ userId: req.user.id });
    if (error) {
      return next(new CustomError(error.details[0].message, 400));
    }

    const result = await subscriptionManager.getUserSubscription(req, res, next);
    return result;

  } catch (error) {
    console.error("Error in getUserSubscription controller:", error);
    return next(new CustomError(error.message || "Internal Server Error", 500));
  }
};


exports.cancelSubscription = async (req, res, next) => {
  try {
    await subscriptionManager.cancelSubscription(req, res, next);
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.updateSubscriptionPlan = async (req, res, next) => {

    try {
        if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
            return next(new CustomError(unsupportedDBType, 400));
        }

        const schema = buildSchema( updateSubscriptionInput);

        const { error } = schema.validate(req.body);
        if (error) return next(new CustomError(error.details[0].message, 400));

        const result = await subscriptionManager.updateSubscriptionPlan(req, res, next);

        return result;
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
};


exports.createPayments = async(req, res , next) =>{
    try{
        if(!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)){
            return next(new CustomError(unsupportedDBType,400));
        }
        const schema = buildSchema(createPaymentsInput);

        const {error} = schema.validate(req.body);
        if (error) return next(new CustomError(error.details[0].message, 400));

        const result = await subscriptionManager.createPayments(req,res,next);
        return result;
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
};


exports.listPayments = async (req,res,next) => {
 try{
    if(!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
        return next(new CustomError(unsupportedDBType, 400))
    }
   const result = await subscriptionManager.listPayments(req,res);
   return result;

 } catch(error){
    return next(new CustomError(error.message, 500))
 }
}











