import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { decrypt } from "./encrypt";

const prisma = new PrismaClient();
const User = prisma.user;

export function verify(req: any, res: any, next: any) {
  let token: string;
  token = req.cookies.access_token;

  if (!token) {
    return res.status(403).send();
  }

  let payload: void;
  try {
    const jwtSec = process.env.JWT_SEC as string;
    payload = jwt.verify(token, jwtSec, function (err?: any, decoded?: any) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token.",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).send({
      message: e.message || "An error occurred while verifying the token.",
      payload,
    });
  }
}

export function verifyPassword(password: string) {
  /* set regex to check for 
    - at least 8 characters
    - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
    - Can contain special characters
    */
  let check = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return check.test(password);
}

/** Regex-check string conforms to email pattern */
export function verifyEmail(email: string) {
  return new RegExp(/^\w{3,}@\w+\.\w+$/).test(email);
}

/** Check no pre-existing user with `email` */
export async function checkUserExists(email: string) {
  const user = await User.findUnique({ where: { email } });
  return Boolean(user);
}

/** Assert hashed password matches stored */
export async function comparePassword(password: string, user_password: string) {
  let decryptedPassword = decrypt(user_password);
  if (decryptedPassword !== password) return false;
  return true;
}
