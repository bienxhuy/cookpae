import express from "express";
import cors from "cors";

import userRouter from "./routes/user.route";

// Create Express app and configure middleware
const app = express();

app.use(express.json());
app.use(cors());

// Endpoints
app.use("/api/users", userRouter);
app.get("/api/health", (_, res) => {res.json({ status: "ok" });});
app.use((_, res) => {res.status(404).json({ status: "error", message: "Route not found" });});

export default app;
