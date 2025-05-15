require("dotenv").config({ path: process.env.ENV_PATH || ".env" });

const getPostgresConfig = () => {
  return {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: process.env.POSTGRES_DIALECT || "postgres",
    dialectOptions: {
      ssl: process.env.POSTGRES_SSL === "true" && {
        require: true,
        rejectUnauthorized: false, 
      },
    },
  };
};



module.exports = {
  development: getPostgresConfig(),
  test: getPostgresConfig(),
  production: getPostgresConfig(),
};

