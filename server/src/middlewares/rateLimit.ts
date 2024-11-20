import rateLimit from "express-rate-limit";

// Define rate limiting options (e.g., 5 requests per minute)
export const loginRateLimit = rateLimit({
  windowMs: 60 * 1000 * 5, // 5 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
});
