import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import areaRouter from "./routes/area.route";
import categoryRouter from "./routes/category.route";
import ingredientRouter from "./routes/ingredient.route";
import recipeRouter from "./routes/recipe.route";
import queryRouter from "./routes/query.route";
import document from "./routes/document.route";
import notificationRouter from "./routes/notification.route";


// Create Express app and configure middleware
const app = express();

// Increase body size limit for image uploads (50MB for JSON with base64 images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors(
  // Temporary for development purposes
  {origin: "http://localhost:5173", credentials: true}
));
app.use(cookieParser());
app.use(passport.initialize());


// Endpoints
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/query", queryRouter);
app.use("/api/documents", document);
app.use("/api/areas", areaRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/notifications", notificationRouter);
app.get("/api/health", (_, res) => {res.json({ status: "ok" });});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((_, res) => {res.status(404).json({ status: "error", message: "Route not found" });});


export default app;

