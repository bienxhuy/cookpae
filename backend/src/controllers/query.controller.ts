import { Request, Response } from "express";
import { RecipeQueryService } from "../services/AI/recipe-query.service";

export class RecipeQueryController {
  constructor(
    private queryService: RecipeQueryService,
  ) {}

  /**
   * POST /api/query/natural
   */
  async query(req: Request, res: Response) {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({
          success: false,
          message: "Thiếu hoặc prompt không hợp lệ",
        });
      }

      const result = await this.queryService.query(prompt.trim());

      res.json({
        success: true,
        data: result, 
      });
    } catch (error: any) {
      console.error("AI Query error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi xử lý truy vấn AI",
      });
    }
  }
}