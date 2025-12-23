import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { EmbeddingService } from "./embedding.service";
import { RecipeService } from "../recipe.service";
import { Recipe } from "../../entities/Recipe";
import { RecipeIngredient } from "../../entities/RecipeIngredient";

export class RecipeQueryService {
  private llm: ChatGroq;

  constructor(
    private embeddingService: EmbeddingService,
    private recipeService: RecipeService
  ) {
    // this.llm = new ChatGoogleGenerativeAI({
    //   model: "gemini-2.0-flash",
    //   apiKey: process.env.GOOGLE_API_KEY!,
    //   temperature: 0.3,
    //   maxRetries: 2,  
    // });
    this.llm = new ChatGroq({
      model: "llama-3.1-8b-instant", 
      apiKey: process.env.GROQ_API_KEY!,
      temperature: 0.7,
    });
  }

  async query(userPrompt: string): Promise<{ answer: string; recipeId?: number }> {
    const dbQueryPrompt = `Trích xuất thông tin tìm kiếm từ câu lệnh: "${userPrompt}". 
    Trả về JSON object duy nhất. 
    LƯU Ý: 
    - "ingredients" chỉ lấy tên danh từ (ví dụ: "thịt bò", không lấy "500g thịt bò"). 
    - "area" chỉ lấy tên vùng miền nếu có.
    - "keyword" là tên món ăn chính.

    Format: {"keyword": "string", "ingredients": ["string"], "area": "string"}`;
    const dbQueryResponse = await this.llm.invoke(dbQueryPrompt);
    let searchParams = { keyword: "", ingredients: [], area: "" };
    
    try {
      const cleanedJson = (dbQueryResponse.content as string)
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      searchParams = JSON.parse(cleanedJson);
    } catch (e) {
      console.error("JSON Parse Error, using fallback");
    }
    console.log("Search Params:", searchParams);
    console.log("User Prompt:", userPrompt);
    const [ragDocs, dbRecipes] = await Promise.all([
      
      this.embeddingService.searchSimilar(userPrompt, 3),
      this.searchRecipesWithParams(searchParams)
    ]);

    const ragContext = ragDocs.map(d => d.pageContent).join("\n\n");
    const dbContext = dbRecipes.length > 0
      ? dbRecipes.map(r => `- ID: ${r.id}, Name: ${r.name}, Ingredients: ${r.ingredients.join(", ")}`).join("\n")
      : "No recipes found in database.";

    const finalPrompt = `
      You are a professional chef.
      USER REQUEST: ${userPrompt}
      DATABASE RECIPES: ${dbContext}
      RAG KNOWLEDGE: ${ragContext}

      INSTRUCTIONS:
      - If a recipe from DATABASE RECIPES matches the user's need, use it.
      - Mention the recipe name clearly.
      - Provide: 1. Name, 2. Ingredients, 3. Steps, 4. Tips.
      - Answer in Vietnamese.
    `;
    console.log("Final Prompt:", finalPrompt);
    const answer = await this.llm.invoke(finalPrompt);
    const answerText = answer.content as string;
    console.log("LLM Answer:", answerText);
    const matchedRecipe = dbRecipes.find(r =>
      answerText.toLowerCase().includes(r.name.toLowerCase())
    );

    return {
      answer: answerText,
      recipeId: matchedRecipe?.id,
    };
  }

  private async searchRecipesWithParams(params: {
    keyword?: string;
    ingredients?: string[];
    area?: string;
  }) {
    const result = await this.recipeService.searchRecipesByText({
      keyword: params.keyword,
      ingredientNames: params.ingredients,
      areaName: params.area,
      page: 1,
      pageSize: 2
    });
    console.log(`Found ${result.total} recipes from DB search, ${result}`);
    return result.recipes.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || "",
      ingredients: r.recipeIngredients
        ?.sort((a, b) => a.order - b.order)
        .map(ri => `${ri.ingredient.name} ${ri.quantity || ""}${ri.unit || ""}`.trim()) || []
    }));
  }
}