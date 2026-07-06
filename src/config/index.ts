import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  node_env: process.env.NODE_ENV,

  port: Number(process.env.PORT) || 4000,

  database_url: process.env.DATABASE_URL as string,

  app_url: process.env.APP_URL,

  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,

  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,

  jwt_access_expiration: process.env.JWT_ACCESS_EXPIRATION!,

  jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION as string,
};

export default config;
