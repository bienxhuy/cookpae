import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { User } from "./entities/User";
import { Recipe } from "./entities/Recipe";
import { Category } from "./entities/Category";
import { Area } from "./entities/Area";
import { Vote } from "./entities/Vote";
import { Ingredient } from "./entities/Ingredient";
import { RecipeIngredient } from "./entities/RecipeIngredient";
import { Step } from "./entities/Step";
import { Attachment } from "./entities/Attachment";
import { Notification } from "./entities/Notification";
import { RefreshToken } from "./entities/RefreshToken";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [
    User, 
    Recipe, 
    Category, 
    Area, 
    Vote, 
    Ingredient, 
    RecipeIngredient, 
    Step, 
    Attachment, 
    Notification,
    RefreshToken],
  migrations: ["src/migrations/*.ts"],
});
