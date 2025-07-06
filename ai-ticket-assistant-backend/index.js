import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { serve } from "inngest/express";
import mongoose from "mongoose";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", userRoutes);

app.use(
  "/api/inngest",
  serve({ client: inngest, functions: [onUserSignup, onTicketCreated] })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(3000, () => console.log("🚀 Server at http://localhost:3000"));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
