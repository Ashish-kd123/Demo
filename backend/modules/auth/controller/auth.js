const {
    loginInput,
    signupInput
  } = require("../validations/auth");
  const { buildSchema } = require("../../../middlewares/joiValidations");
  const authManager = require("../manager/auth");
  const { supportedDbTypes } = require("../utils/staticData");
  const { unsupportedDBType } = require("../utils/messages");
  const CustomError = require("../../../middlewares/customError");


  exports.login = async (req, res, next) => {
    try {
      if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
        return next(new CustomError(unsupportedDBType, 400));
      }
      const schema = buildSchema(loginInput);
  
      const { error } = schema.validate(req.body);
      if (error) return next(new CustomError(error.details[0].message, 400));
  
      const result = await authManager.login(req, res, next);
      return result;
    } catch (error) {
      return next(new CustomError(error.message, 500));
    }
  };
  
  exports.signup = async (req, res, next) => {
    try {
      if (!Object.keys(supportedDbTypes).includes(process.env.DB_TYPE)) {
        return next(new CustomError(unsupportedDBType, 400));
      }
      const schema = buildSchema(signupInput);
  
      const { error } = schema.validate(req.body);
      if (error) return next(new CustomError(error.details[0].message, 400));
  
      const result = await authManager.signup(req, res, next);
      return result;
    } catch (error) {
      return next(new CustomError(error.message, 500));
    }
  };