export const {
  PORT = 4001,
  UIPORT = 5173,
  NODE_ENV: env = "development",
  APP_UI = "http://localhost:5173", // NOTE: APP_UI must use same port as UIPORT!
  EXIT_AFTER_REFLECTION = false,

  //   AWS
  AWS_DEFAULT_REGION = "us-east-1",

  //   OPEN AI
  OPENAI_KEY = ""
} = process.env;

export const IMGS_BUCKET = process.env.AWS_IMGS_BUCKET || "";
export const AWS_USER_IMGS_BUCKET = `${IMGS_BUCKET}/users`;
export const AWS_BOOK_IMGS_BUCKET = `${IMGS_BUCKET}/books`;
export const AWS_WORLDS_IMGS_BUCKET = `${IMGS_BUCKET}/worlds`;
export const AWS_LOCTNS_IMGS_BUCKET = `${IMGS_BUCKET}/locations`;
export const AWS_CHAR_IMGS_BUCKET = `${IMGS_BUCKET}/characters`;
export const AWS_EXPL_IMGS_BUCKET = `${IMGS_BUCKET}/explorations`;
export const AWS_EXPSCENES_IMGS_BUCKET = `${AWS_EXPL_IMGS_BUCKET}/scenes`;
export const AWS_UPLOADS_URL = `https://s3.${AWS_DEFAULT_REGION}.amazonaws.com/${IMGS_BUCKET}`;
