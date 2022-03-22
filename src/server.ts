import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/admin/auth";
import userRoutes from "./routes/user.routes";

dotenv.config({ path: './../.env'});

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(3002, () => {
  console.log("Server running on port: 3002");
});
