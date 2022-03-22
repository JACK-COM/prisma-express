import express from "express";
import * as user from "../controllers/users/user.controller";

const UserRouter = express.Router();
UserRouter.get("/", user.findAllUser);
UserRouter.get("/:id", user.findOneUser);

UserRouter.post("/", user.createUser);
UserRouter.put("/:id", user.updateUser);
UserRouter.delete("/:id", user.deleteUser);

export default UserRouter;
