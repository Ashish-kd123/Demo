require("dotenv").config({ path: process.env.ENV_PATH || ".env" });
const { Sequelize } = require("sequelize");

const connectPostgres = async () => {
    const sequelize = new Sequelize(
      process.env.POSTGRES_DB,
      process.env.POSTGRES_USER,
      process.env.POSTGRES_PASSWORD,
      {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: process.env.POSTGRES_DIALECT,
        dialectOptions: {
          ssl: {
            require: false, 
            rejectUnauthorized: false, 
          },
          ssl: false,
        },
      }
    )
    await sequelize
    .authenticate()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Unable to connect to PostgreSQL:", err));

  return sequelize;
};

const connectDatabase = async () => {
  try {
    const sequelize = await connectPostgres(); // Get the sequelize instance
    console.log("Connected to PostgreSQL database successfully.");
    return sequelize; // Return the sequelize instance
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    throw error;
  }
};
  
  
  module.exports = connectDatabase;