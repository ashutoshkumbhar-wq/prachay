import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import path from "path";
import authRoutes from "./routes/auth";
import voucherRoutes from "./routes/vouchers";
import { errorHandler } from "./middleware/error";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use("/api/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_DIR || "uploads")));

const swagger = {
  openapi: "3.0.0",
  info: { title: "ABC Expense Voucher API", version: "1.0.0" },
  servers: [{ url: "http://localhost:5000" }],
  paths: {
    "/api/auth/login": { post: { summary: "Login", requestBody: { required: true }, responses: { "200": { description: "OK" } } } },
    "/api/auth/me": { get: { summary: "Current user", responses: { "200": { description: "OK" } } } },
    "/api/vouchers": { get: { summary: "List vouchers" }, post: { summary: "Create voucher" } }
  }
};

app.get("/api/health", (_req, res) => res.json({ success: true, message: "API is running" }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swagger));
app.use("/api/auth", authRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));