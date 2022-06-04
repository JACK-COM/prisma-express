import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";

import authRoutes from "./routes/admin/auth";
import userRoutes from "./routes/user.routes";

dotenv.config({ path: "./../.env" });

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);

const userRoutesLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/users", userRoutesLimit, userRoutes);

app.listen(3002, () => {
  console.log("Server running on port: 3002");
});
