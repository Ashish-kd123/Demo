const mainHelper = require("../../../utils/helper");
const jwt = require("jsonwebtoken");

const generateAccessToken = async (user) => {
  const tokenObj = {
    id: user.id,
    uuid: user.uuid,
    mobile: user.mobile,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  if (user.roles && user.roles.length > 0) {
    tokenObj["roles"] = user.roles.map((a) => a.name);
  }

  const token = jwt.sign(tokenObj, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
  });

  return token;
};

module.exports = {
  ...mainHelper,
  generateAccessToken,
};
