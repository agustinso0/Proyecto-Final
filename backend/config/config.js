require("dotenv").config();

const getMongoConfig = (env = "development") => {
  const name = process.env.DB_NAME || "database";
  const dbName = env === "test" ? `${name}_test` : name;
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 27017;

  let uri = process.env.MONGODB_URI
    ? process.env.MONGODB_URI
    : `mongodb://${host}:${port}/${dbName}`;

  return {
    uri,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  };
};

const config = {
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || "development",
  },

  database: getMongoConfig(process.env.NODE_ENV || "development"),

  jwt: {
    secret: process.env.JWT_SECRET || "fallback",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
    optionsSuccessStatus: 200,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000,
  },

  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },

  environments: {
    development: getMongoConfig("development"),
    test: getMongoConfig("test"),
    production: getMongoConfig("production"),
  },
};

module.exports = config;
