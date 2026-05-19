/**
 * VolunteerHub Backend Server
 * Express application with MongoDB integration and REST API routes.
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
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

/**
 * Middleware
 */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Static uploads
 * Lưu ý: Vercel không phù hợp để lưu file upload lâu dài.
 */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * Connect MongoDB
 * Không dùng await top-level để tránh crash serverless function.
 */
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/**
 * Không chạy cron job trên Vercel serverless.
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