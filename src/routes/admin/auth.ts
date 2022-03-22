import express from "express";
import { signUp, login } from "../../controllers/admin/auth.controller";

const AuthRouter = express.Router();
AuthRouter.post("/signup", signUp);
AuthRouter.post("/login", login);

export default AuthRouter;
