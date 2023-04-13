// import { comparePassword } from "../middleware/verify";
// import jwt from "jsonwebtoken";
// import { context } from "../graphql/context";

// const { Users: User } = context;

export async function OldLogin(/* req: any, res: any */) {
  throw new Error("Unintended use of old login function");
  /* const { email, password } = req.body;
  let message = "Missing fields are required";
  if (!email || !password) return res.status(404).json({ message });

  const user = await User.findFirst({ where: { email } });
  message = "User not found";
  if (!user) return res.status(404).json({ message });

  const validPwd = await comparePassword(password, user.password);
  message =
    "The username or password are incorrect. Please try again, or contact a site admin.";

  if (!validPwd) return res.status(401).json({ message });

  const jwtSec = process.env.JWT_SEC as string;
  const token = jwt.sign({ id: user.id }, jwtSec, { expiresIn: 86400 });
  return res.json({ id: user.id, token }); */
}

export async function refresh(_req: any, _res: any) {}
