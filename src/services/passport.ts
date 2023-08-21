import { Express } from "express";
import cookieParser from "cookie-parser";
import session from "cookie-session";
import passport from "passport";
import { PASSPORT_CONFIG_ERROR, env } from "../constants";
import logger from "../logger";

export default passport;

const maxAge = 86400000; // 24 hours

/** 
 * Set up `PassportJs` routes and integration. This will enable user 
 * session tracking via Google or Local auth
 */
export function configurePassport(app: Express) {
  const secret = process.env.JWT_SEC;
  if (!secret) {
    logger.error(PASSPORT_CONFIG_ERROR);
    throw new Error(PASSPORT_CONFIG_ERROR);
  }
  const secure = env === "production";
  const sessionCookie = { maxAge, httpOnly: true, secure };
  const sessionOpts = {
    cookie: sessionCookie,
    secret,
    resave: true,
    saveUninitialized: true
  };

  app.use(cookieParser(secret));
  app.use(session(sessionOpts));
  // register regenerate & save after the cookieSession middleware initialization
  // See: https://github.com/jaredhanson/passport/issues/904#issuecomment-1307558283
  app.use(function (req, _res, next) {
    if (req.session && !req.session.regenerate) {
      req.session.regenerate = ((cb: any) => {
        cb();
      }) as any;
    }
    if (req.session && !req.session.save) {
      req.session.save = ((cb: any) => {
        cb();
      }) as any;
    }
    next();
  });
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize authenticated user
  passport.serializeUser(function serializeUser(user, done) {
    process.nextTick(function () {
      return done(null, JSON.stringify(user));
    });
  });

  // unpack stored user
  passport.deserializeUser(function deserializeUser(user: string, done) {
    process.nextTick(function () {
      return done(null, JSON.parse(user));
    });
  });

  return passport;
}
