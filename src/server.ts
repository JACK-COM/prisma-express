// import "graphql-import-node";
import { ApolloServer } from "apollo-server-express";
import { json } from "body-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { schema } from "./graphql/index";
import { context } from "./graphql/context";
import logger from "./logger";
import { configurePassport } from "./services/passport";
import {
  FRONTEND_URL,
  PORT,
  GOOGLE_CLIENT_ID as clientID,
  GOOGLE_CLIENT_SK as clientSecret,
  env
} from "./constants";
import {
  fileDeleteHandler,
  fileUploadHandler,
  listUserFilesHandler
} from "./services/aws.service";
import multer from "multer";
import GoogleStrategy from "passport-google-oidc";
import LocalStrategy from "passport-local";
import configureAuthRoutes from "./routes/auth.router";
import { verifyFederated, verifyLocal } from "./middleware/verify";
import { rateLimit } from "express-rate-limit";

/** Run server */
async function main() {
  const app = express();
  app.set("trust proxy", env !== "production");
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // CORS
  const origin = [FRONTEND_URL];
  if (env !== "production") origin.push("https://studio.apollographql.com");
  app.use("*", cors({ credentials: true, origin }), json());
  configureRateLimiter(app); // rate Limiter

  // PassportJS authentication
  const passport = configurePassport(app);
  const callbackURL = `/oauth2/redirect/google`;
  // PassportJS | Enable Google sign-in strategy
  passport.use(
    new GoogleStrategy({ clientID, clientSecret, callbackURL }, verifyFederated)
  );
  // PassportJS | Enable "local" (username/password) sign-in strategy
  passport.use(
    new LocalStrategy.Strategy({ usernameField: "email" }, verifyLocal)
  );

  // Register Express authentication routes (auth.router.ts)
  configureAuthRoutes(app, passport);

  // APOLLO SERVER
  const apolloServer = new ApolloServer({
    context: ({ req }) => ({ ...context, user: req.user }),
    schema,
    cache: "bounded",
    persistedQueries: false,
    logger
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: { credentials: true, origin } });

  // ADDITIONAL NON-GRAPHQL ROUTES
  app.get("/health", (_req, res) => res.status(200).send("OK"));

  // AWS File Uploads
  app.post("/files/:category/delete", fileDeleteHandler);
  app.post("/files/:category/list", listUserFilesHandler);
  const upload = multer();
  // NOTE: This expects a form-data body with a file field named
  // `imageFile`! Change the parameter of upload.single to match your
  // form field name
  app.post(
    "/files/:category/upload",
    upload.single("imageFile"),
    fileUploadHandler
  );

  // RUN APP
  app.listen(PORT, async () => {
    let live = "LIVE";
    if (env !== "production") {
      logger.warn(`${env} mode active`);
      live = `${live} (${env}) @${PORT}/graphql`;
    } else live = `${live} @${PORT}`;
    logger.info(live);
  });
}
main();

/** (Optional) Set up rate-limits for accessing your server app */
function configureRateLimiter(app: any) {
  if (env !== "production") return;
  const message = "Too many requests; please try again later";
  const data = { __typename: "ResponseErrorMessage", message };
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message,
    handler(opts) {
      opts.res?.status(429).send({ data });
    }
  });
  app.use(limiter);
}
