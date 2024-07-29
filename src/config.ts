import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongo: {
    uri: process.env.MONGO_URL as string,
  },
  EMAIL_NODEMAILER: process.env.EMAIL_NODEMAIL as string,

  PASSWORD_NODEMAILER: process.env.PASSWORD_NODEMAIL as string,
  jwt: {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
  },
  nodeEnvironment: process.env.NODEENVIRONMENT as string,

  cloudinary: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  },
};

export type ConfigType = typeof config;

export default config;
