import express, { Express, NextFunction, Request, Response } from "express";
import { AuthenticateOptions, PassportStatic } from "passport";
import { FRONTEND_URL } from "../constants";
import { createUserLocal } from "../middleware/verify";

// AUTH ROUTES
const GOOGLE_LOGIN_REDIRECT = "/oauth2/redirect/google";
const LOGIN_CLIENT = `${FRONTEND_URL}/login`;
const LOGIN_LOCAL = "/login/credentials";
const LOGIN_GOOGLE = "/login/google";
const LOGOUT = "/logout";
const LOGOUT_CLIENT = `${FRONTEND_URL}${LOGOUT}`;
const LOGGED_IN = "/authenticated";
const REGISTER_LOCAL = "/register/credentials";

const PASSPORT_OPTS: AuthenticateOptions = {
  failureRedirect: LOGIN_CLIENT,
  failureMessage: true,
  session: true
};

export default function configureAuthRoutes(
  app: Express,
  passport: PassportStatic
) {
  const AuthRouter = express.Router();
  // Trigger "Sign in with Google"
  AuthRouter.get(
    LOGIN_GOOGLE,
    passport.authenticate("google", { scope: ["email"] })
  );

  // Complete "Sign in with google"
  const googleOpts = { ...PASSPORT_OPTS, successRedirect: FRONTEND_URL };
  AuthRouter.get(
    GOOGLE_LOGIN_REDIRECT,
    passport.authenticate("google", googleOpts)
  );

  // Trigger "Sign in with email/password"
  AuthRouter.post(LOGIN_LOCAL, function (req, res, next) {
    passport.authenticate("local", function (err: any, user: any, info: any) {
      if (err) return res.status(401).send(err.message);
      if (!user) return res.status(401).send(info.message);
      return req.logIn(user, function (err) {
        if (err) return next(err);
        return res.json({ user: req.user });
      });
    })(req, res, next);
  });

  // Register with email/password
  AuthRouter.post(REGISTER_LOCAL, function (req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return void res.status(400).send("email and password required");
    }

    createUserLocal(email, password, function (err, user) {
      if (err) {
        const e = typeof err === "string" ? new Error(err) : err;
        return void res.status(400).send(e.message);
      }

      if (!user) return void res.status(400).send("Error creating user");

      return req.logIn(user, function (err) {
        if (err) return next(err);
        return res.json({ user: req.user });
      });
    });
  });

  // Check logged in (general)
  AuthRouter.post(LOGGED_IN, (req, res, _next) => {
    res.json({ user: req.isAuthenticated() ? req.user : null });
  });

  // Logout (all strategies)
  AuthRouter.get(LOGOUT, handleLogout);

  app.use("/", AuthRouter);
}

/** shared logout handler */
function handleLogout(req: Request, res: Response, next: NextFunction) {
  req.logout(function (err) {
    if (err) return next(err);
    req.logout(() => res.redirect(LOGOUT_CLIENT));
  });
}
