/**
 * VolunteerHub Backend Server
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
// import { startCronJobs } from "./utils/cronJob.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import registrationRoutes from "./routes/registration.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import eventActionRoutes from "./routes/eventAction.routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isServerless = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

/**
 * Tạo folder uploads để tránh lỗi:
 * ENOENT: no such file or directory, mkdir 'uploads/avatars'
 */
if (!isServerless) {
  const uploadDir = path.join(process.cwd(), "uploads");
  const avatarDir = path.join(process.cwd(), "uploads", "avatars");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
  }
}

/**
 * Middleware
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed =
        allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");

      if (isAllowed) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      console.log("Allowed origins:", allowedOrigins);

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!isServerless) {
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
}

/**
 * MongoDB connection
 */
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/**
 * Không chạy cron job trên Vercel serverless
 */
// startCronJobs();

/**
 * Test routes
 */
app.get("/", (req, res) => {
  res.send("✅ VolunteerHub Backend API is running...");
});

app.get("/api/health", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully" });
});

/**
 * API routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/actions", eventActionRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/notifications", notificationRoutes);

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
  });
});

export default app;