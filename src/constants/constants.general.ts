// all values must be in .env file if used
export const {
  PORT = 4001,
  NODE_ENV: ENV = "development",
  FRONTEND_URL = "http://localhost:3000",
  ENCRYPT_SECRET = "secret123",

  //   AWS
  AWS_DEFAULT_REGION = "us-east-1",
  AWS_IMGS_BUCKET: IMGS_BUCKET = "",

  //   OPEN AI
  OPENAI_KEY = "",

  //   DISCORD
  DISCORD_ID = "",
  DISCORD_SECRET = "",
  DISCORD_REDIRECT = "",
  DISCORD_BOT_TOKEN = "",

  //   GOOGLE
  GOOGLE_CLIENT_ID = "",
  GOOGLE_CLIENT_SK = ""
} = process.env;
export const AWS_USER_IMGS_BUCKET = `${IMGS_BUCKET}/users`;
export const AWS_UPLOADS_URL = `https://s3.${AWS_DEFAULT_REGION}.amazonaws.com/${IMGS_BUCKET}`;
export const MAX_RETRIES = 3;
export const IS_PROD = ENV === "production";

export function BaseUrl(): string {
  return FRONTEND_URL;
}
