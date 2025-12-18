import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

import userRouter from "./routes/user.route";
import areaRouter from "./routes/area.route";
import categoryRouter from "./routes/category.route";


// Create Express app and configure middleware
const app = express();

app.use(express.json());
app.use(cors());


// Endpoints
app.use("/api/users", userRouter);
app.use("/api/areas", areaRouter);
app.use("/api/categories", categoryRouter);
app.get("/api/health", (_, res) => {res.json({ status: "ok" });});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((_, res) => {res.status(404).json({ status: "error", message: "Route not found" });});


export default app;
