// config/config.js
require("dotenv").config();

const getMongoConfig = (env = "development") => {
  const baseName = process.env.DB_NAME || "app_database";
  const dbName = env === "test" ? `${baseName}_test` : baseName;
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 27017;

  return {
    uri: `mongodb://${host}:${port}/${dbName}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  };
};

module.exports = {
  development: getMongoConfig("development"),
  test: getMongoConfig("test"),
  production: getMongoConfig("production"),
};
