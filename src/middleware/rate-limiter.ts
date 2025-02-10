import { Express } from "express";
import rateLimit from "express-rate-limit";

/** Rate-limiter for routes */
export default function configureRateLimiter(app: Express) {
  const limiter = rateLimit({
    windowMs: 1000,
    limit: 12,
    standardHeaders: "draft-7",
    legacyHeaders: false
  });

  app.use(limiter);
}
