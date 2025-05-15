const express = require("express");
const authService = require("../services/auth.js");
const {
  sendResponse,
generateAccessToken,
} = require("../utils/helper.js");

exports.signup = async (req, res) => {
  try {
    const {  email, fullName, password } = req.body;

    let userExists = await authService.findUser({ email: email.toLowerCase() });
    if (userExists) {
      return sendResponse(res, 400, false, "Email already exists");
    }

    const result = await authService.signup({
      email,
      fullName,
      password,
      
    });

   
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "User successfully created",
      data: result.user,
      token: result.token, 
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Something went wrong during signup",
      error: error.message,
    });
  }
};

  exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      const result = await authService.login(email, password);
  
      return res.status(200).json({
        message: "Login successful",
         token: result.token,
      });
    } catch (err) {
      next(err);
    }
  };