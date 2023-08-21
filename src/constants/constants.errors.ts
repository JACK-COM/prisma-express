export const UNAUTHENTICATED =
  "Unauthenticated: Please log in to perform that action";
export const UNAUTHORIZED = "You cannot perform that action";
export const NO_EMAIL = "Email not found";
export const NO_ID = "Id required but not found";
export const NO_NAME = "Name not found";
export const NO_PASSWORD = "Password not found";
export const NO_USER = "User not found";
export const USER_EMAIL_EXISTS = "Email already exists";
export const PASSPORT_CONFIG_ERROR = `PassportJS Configuration Error: 
env JWT_SEC not set. Please run "npm run generate-keys" and transfer contents to .env file.

If you don't want to use this feature, remove the "configurePassport" function in src/server.ts`
