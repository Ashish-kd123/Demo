const { getAllModels } = require("../../../middlewares/loadModels");
require('dotenv').config();

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../../utils/helper");




const findUser = async (where) => {
    if (typeof where !== "object" || Array.isArray(where) || where === null || Object.keys(where).length === 0) {
      throw new Error("Invalid 'where' condition. Must be a non-empty object.");
    }
  
    const sanitizedWhere = Object.fromEntries(
      Object.entries(where).filter(([_, v]) => v !== undefined)
    );
  
    const { Users } = await getAllModels(process.env.DB_TYPE);
    
      console.error("Loaded models:", Users);
    if (!Users) {
      throw new Error("User model not found");
    }
    let includes = [];
  
    const user = await Users.findOne({
      where: sanitizedWhere,
      include: includes,
    });
  
    return user;
  };

const signup = async (requestBody) => {
    if (
      typeof requestBody !== "object" ||
      Object.keys(requestBody).length === 0
    ) {
      throw { message: "Invalid request body" };
    }
    const { Users, sequelize } = await getAllModels(process.env.DB_TYPE);
    const transaction = await sequelize.transaction();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(requestBody.password, salt);
  
    try {
      requestBody.email = requestBody.email.toLowerCase();
      requestBody["uuid"] = uuidv4();
      requestBody.password = hashedPassword;
      requestBody["isActive"] = true;
  
      const user = await Users.create(requestBody, { transaction });
  
      await transaction.commit();
      const token = generateToken({ id: user.id, email: user.email });

    return {
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  const login = async (email, password) => {
    
      const user = await findUser({ email: email.toLowerCase() });
  
      if (!user) {
        throw { status: 401, message: "Invalid email or password" };
      }
      const isMatch = await bcrypt.compare(password, user.password);    
      if (!isMatch) {
        throw { status: 401, message: "Invalid email or password" };
      }
  
      const token = generateToken({ id: user.id, email: user.email });
  
      return {
        token,
      };
  
    
  };


  module.exports ={
    login,
  signup,
  findUser
  }
  