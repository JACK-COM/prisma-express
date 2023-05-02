import "graphql-import-node";
import { ApolloServer } from "apollo-server-express";
import { json } from "body-parser";
import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import { schema } from "./graphql/index";
import { context } from "./graphql/context";
import logger from "./logger";
import { configurePassport } from "./services/passport";
import { downloadBookHandler } from "./services/document.service";
import { generateWritingPromptHandler } from "./services/openai.service";
import { PORT, UIPORT, env } from "./constants";
import { fileDeleteHandler, fileUploadHandler, listUserFilesHandler } from "./services/aws.service";
import multer from "multer";

/** Run server */
async function main() {
  const app = express();
  app.set("trust proxy", env !== "production");

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // CORS
  const origin = [
    `http://localhost:${UIPORT}`,
    "https://studio.apollographql.com"
  ];
  app.use("*", cors({ credentials: true, origin }), json());

  configureRateLimiter(app); // rate Limiter
  configurePassport(app); // passportjs

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

  // Books
  app.post("/books/:bookId/download/", downloadBookHandler);
  app.post("/books/writing-prompt", generateWritingPromptHandler);

  // AWS File Uploads
  app.post("/files/:category/delete", fileDeleteHandler);
  app.post("/files/:category/list", listUserFilesHandler);
  const upload = multer();
  app.post("/files/:category/upload", upload.single("imageFile"), fileUploadHandler);

  // LISTEN TO APP
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

function configureRateLimiter(app: Express) {
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
