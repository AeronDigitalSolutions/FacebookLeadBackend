import express from "express";
import dotenv from "dotenv";
dotenv.config(); // 👈 MUST BE FIRST

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
import emailRoutes from "./routes/mailbox";
import inboxRoutes from "./routes/inbox"; // ✅ ADD THIS
import instagramRoutes from "./routes/instagram";
import trackingRoutes from "./routes/tracking";
import emailVerifierRoutes from "./routes/emailVerifier";
import emailLeadsRoutes from "./routes/emailLeads";


dotenv.config();
connectDB();

const app = express();

/* ---------------- CORS CONFIG ---------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://facebooklead.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

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
app.use("/api/email", emailRoutes);
app.use("/api/email", inboxRoutes);   // ✅ INBOX ROUTES
app.use(instagramRoutes);
app.use("/api", trackingRoutes);
app.use("/api/email", emailVerifierRoutes);

app.use("/api/email-leads", emailLeadsRoutes);

/* ---------------- HTTP + SOCKET SERVER ---------------- */
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
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
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket running on port ${PORT}`);
});
