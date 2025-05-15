const jwt = require("jsonwebtoken");


const sendResponse = (
  res,
  statusCode = 200,
  success = true,
  message = "",
  data = null,
  token = null
) => {
   if (data && data.toJSON) {
    data = data.toJSON();
   }
  return res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
    token,
  });
};


const verifyToken = (token, callback) => {
  return jwt.verify(token, process.env.JWT_SECRET, {}, callback);
};


const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = {
  sendResponse,
  verifyToken,
  generateToken,
};
