import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { json } from "body-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { schema } from "./graphql/index";
import { CtxUser, DBContext, context } from "./graphql/context";
import http from "http";
import logger from "./logger";
import { configurePassport } from "./services/passport";
import { BaseUrl, PORT, IS_PROD, ENV } from "./constants";
import multer from "multer";
import configureAuthRoutes from "./routes/auth.router";
import { fileUploadHandler } from "./services/aws.service";
import { configureRateLimiter } from "./middleware/auth.guards";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/** Run server */
async function main() {
  const app = express();
  app.set("trust proxy", Number(!IS_PROD));
  app.use(
    morgan(
      '{"method": ":method","url": ":url","status": ":status","content-length": ":res[content-length]","response-time": ":response-time"}'
    )
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // CORS
  // Splice www subdomain into allowed origins
  const APP_UI = BaseUrl();
  const origins = new Set([APP_UI]);
  if (!IS_PROD) {
    origins.add("https://studio.apollographql.com");
  } else origins.add(APP_UI.replace("://", "://www."));
  const origin = Array.from(origins);
  logger.info(`CORS allowed origins: ${origin.join(", ")}`);
  const CORS_MIDDLEWARE = cors({ credentials: true, origin });
  app.use("*", CORS_MIDDLEWARE, json());

  // RATE LIMITER
  configureRateLimiter(app); // rate Limiter

  // HEALTH CHECK
  app.get("/", (_req, res) => res.status(200).send("OK"));

  // PASSPORTJS
  // PassportJS authentication
  const passport = configurePassport(app);
  // Register Express authentication routes (auth.router.ts)
  configureAuthRoutes(app, passport);

  // ADDITIONAL NON-GRAPHQL ROUTES

  // File Uploads
  const upload = multer({
    limits: {
      fieldSize: MAX_FILE_SIZE_BYTES, // 10MB
      fileSize: MAX_FILE_SIZE_BYTES, // 10MB
      files: 1
    }
  });

  // NOTE: This expects a form-data body with a file field named `imageFile`!
  app.post(
    "/files/:category/upload",
    upload.single("imageFile"),
    fileUploadHandler
  );

  // GLOBAL ROUTE GUARDS

  // Create HTTP server
  const httpServer = http.createServer(app);
  // ATTACH APOLLO SERVER
  const apolloServer = new ApolloServer<DBContext>({
    schema,
    cache: "bounded",
    persistedQueries: false,
    logger,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  await apolloServer.start();

  app.use(
    "/graphql",
    CORS_MIDDLEWARE,
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ ...context, user: req.user as CtxUser })
    })
  );

  // LISTEN TO APP START
  httpServer.listen(PORT, () => {
    let live = "LIVE";
    if (!IS_PROD) {
      logger.warn(`${ENV} mode active`);
      live = `${live} (${ENV}) @${PORT}/graphql`;
    } else live = `${live} @${PORT}`;
    logger.info(`🚀 ${live}`);
  });
}

// RUN SERVER
main();
