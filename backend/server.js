import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';

import authRoutes from "./routes/auth.route.js"
import notesRoutes from "./routes/notes.route.js"
import subscriptionRoutes from "./routes/subscription.route.js"
import healthRoutes from "./routes/health.route.js";
import tenantRoutes from "./routes/tenant.route.js";
import { connectDB } from "./lib/db.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5050;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "http://localhost:6050", credentials: true }));
app.use(cookieParser());
app.use(express.json());
 

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/tenants", tenantRoutes)

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server running on PORT: ${PORT}`)
})