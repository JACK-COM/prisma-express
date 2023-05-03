export const {
  PORT = 4001,
  UIPORT = 5173,
  NODE_ENV: env = "development",

  //   AWS
  AWS_DEFAULT_REGION = "us-west-2",

  //   OPEN AI
  OPENAI_KEY = ""
} = process.env;

export const IMGS_BUCKET = process.env.AWS_IMGS_BUCKET || "";
export const AWS_USER_IMGS_BUCKET = `${IMGS_BUCKET}/users`;
export const AWS_BOOK_IMGS_BUCKET = `${IMGS_BUCKET}/books`;
export const AWS_CHAR_IMGS_BUCKET = `${IMGS_BUCKET}/characters`;
export const AWS_UPLOADS_URL = `https://s3.${AWS_DEFAULT_REGION}.amazonaws.com/${IMGS_BUCKET}`;
