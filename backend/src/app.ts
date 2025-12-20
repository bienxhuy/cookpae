import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

import userRouter from "./routes/user.route";
import areaRouter from "./routes/area.route";
import categoryRouter from "./routes/category.route";
import ingredientRouter from "./routes/ingredient.route";
import recipeRouter from "./routes/recipe.route";
import queryRouter from "./routes/query.route";
import document from "./routes/document.route";


// Create Express app and configure middleware
const app = express();

app.use(express.json());
app.use(cors());


// Endpoints
app.use("/api/users", userRouter);
app.use("/api/query", queryRouter);
app.use("/api/documents", document);
app.use("/api/areas", areaRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/recipes", recipeRouter);
app.get("/api/health", (_, res) => {res.json({ status: "ok" });});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((_, res) => {res.status(404).json({ status: "error", message: "Route not found" });});


export default app;

