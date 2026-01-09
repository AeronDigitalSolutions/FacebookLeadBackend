import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import metaAuthRoutes from "./routes/metaAuth";
import metaAssetsRoutes from "./routes/metaAssets";
import campaignRoutes from "./routes/campaign";
import leadRoutes from "./routes/lead";
import formRoutes from "./routes/form";
import submissionRoutes from "./routes/submission";
import googleAdsRoutes from "./routes/googleAds";

dotenv.config();
connectDB();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/api/users", userRoutes);
app.use("/api", metaAuthRoutes);
app.use("/api", metaAssetsRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/forms", submissionRoutes);
app.use("/api/google", googleAdsRoutes);

/* ---------------- HTTP + SOCKET SERVER ---------------- */
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
  },
});

/* ---------------- SOCKET EVENTS ---------------- */
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server + Socket running on port ${PORT}`)
);
