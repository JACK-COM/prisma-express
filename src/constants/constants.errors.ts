export const UNAUTHENTICATED = "Unauthenticated: Please log in first";
export const UNAUTHORIZED = "You cannot perform that action";
export const NO_EMAIL = "Email not found";
export const NO_ID = "Id required but not found";
export const NO_NAME = "Name not found";
export const NO_PASSWORD = "Password not found";
export const NO_USER = "User not found";
export const NO_USERNAME = "Username not found";
export const WEAK_PWD = "New Password is not strong enough";
export const USER_EMAIL_EXISTS = "Email already exists";
export const USER_LOGGED_OUT = "User logged out";
export const USER_SCREENNAME_EXISTS = "Screenname already exists";
export const PASSPORT_CONFIG_ERROR = `PassportJS Configuration Error: 
env JWT_SEC not set. Please run "npm run generate-keys" and transfer contents to .env file.

If you don't want to use this feature, remove the "configurePassport" function in src/server.ts`;
