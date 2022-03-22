import { PrismaClient, User } from "@prisma/client";
import { prepDBUser, pruneDBUser } from "../../utils";

const UserDB = new PrismaClient().user;

const requiredFields = ["display_name", "email", "auth_source"];

/** create user record */
export function createUser(req: any, res: any) {
  let data = prepDBUser(req.body) as User;
  let message = "Missing required fields to create a new user.";
  const missingFields = requiredFields.some((x) => !data[x]);

  if (missingFields || !data.passcode) {
    res.status(400).send({ message });
  }

  UserDB.create({ data })
    .then(({ id }) => {
      message = `User with id ${id} was successfully created`;
      res.send({ message });
    })
    .catch((err: any) => {
      message =
        err.message ||
        "User was not created. Please check your entries and try again.";
      res.status(500).send({ message });
    });
}

/** find all user records matching params */
export function findAllUser(_req: any, res: any) {
  UserDB.findMany()
    .then((data: any) => res.send(data))
    .catch((err: { message: any }) => {
      res.status(500).send({
        message:
          err.message || "The users could not be retrieved. Please try again.",
      });
    });
}

/** find one user record matching params */
export function findOneUser(req: any, res: any) {
  const id = req.params.id;
  UserDB.findUnique({ where: { id } })
    .then((data) => {
      return data === null
        ? res.status(400).json({ message: "User not found" })
        : res.send(pruneDBUser(data));
    })
    .catch((_error) => {
      res.status(500).send({
        message: "The user could not be retrieved. Please try again.",
      });
    });
}

/** update user record with params */
export function updateUser(req: any, res: any) {
  const id = req.params.id;
  let data = prepDBUser(req.body);

  UserDB.update({ where: { id }, data })
    .then((user) => {
      const message = `User with email ${user.email} successfully updated.`;
      res.send({ message });
    })
    .catch((err: any) => {
      const m =
        err ||
        "The user could not be updated. Please check your entries and try again.";
      res.status(500).send({ message: m });
    });
}

/** delete user record matching params */
export function deleteUser(req: any, res: any) {
  const id = req.params.id;

  UserDB.delete({ where: { id: id } })
    .then((user) => {
      const message = `User with email ${user.email} successfully deleted.`;
      res.send({ message });
    })
    .catch((_err: any) => {
      res.status(500).send({
        message: `User with the id of ${id} could not be deleted`,
      });
    });
}
