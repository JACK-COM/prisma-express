import { encrypt } from "../../middleware/encrypt";
import {
  comparePassword,
  verifyEmail,
  checkUserExists,
} from "../../middleware/verify";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// const User = db.users;
const User = prisma.user;

export async function signUp(req: any, res: any) {
  const { display_name, auth_source, email, password } = req.body;
  const data: any = { display_name, auth_source, email };
  data.password = encrypt(password);

  const isUnique = await checkUserExists(data.email);
  let message: string = "";
  let status = 200;

  switch (true) {
    case Object.values(data).some((x) => x == ""): {
      message = "All fields are required to register a new user.";
      status = 400;
      break;
    }

    case !verifyEmail(data.email): {
      message = "Valid email is required.";
      status = 400;
      break;
    }

    case !isUnique: {
      message = "A user with that email is already registered.";
      status = 400;
      break;
    }

    default:
      break;
  }

  if (message) return res.status(status).json({ message });

  try {
    const saved = await User.create({ data });
    const jwtSec = process.env.JWT_SEC as string;
    const expiresIn = 86400;
    const access_token = jwt.sign({ id: saved.id }, jwtSec, { expiresIn });

    return res.status(200).json({ access_token });
  } catch (error) {
    const message = "There was an error creating the user.";
    res.status(500).send({ message });
  }
}

export async function login(req: any, res: any) {
  const { email, password } = req.body;
  let message = "Missing fields are required";
  if (!email || !password) return res.status(404).json({ message });

  const user = await User.findFirst({ where: { email } });
  message = "User not found";
  if (!user) return res.status(404).json({ message });

  const validPwd = await comparePassword(password, user.password);
  message =
    "The username or password are incorrect. Please try again, or contact a site admin.";

  if (!validPwd) {
    return res.status(401).json({ message });
  }

  const jwtSec = process.env.JWT_SEC as string;
  const token = jwt.sign({ id: user.id }, jwtSec, { expiresIn: 86400 });

  return res.json({
    id: user.id,
    token: token,
  });
}

export async function refresh(_req: any, _res: any) {}
