// src/controllers/document.controller.ts
import { Request, Response } from "express";
import { DocumentService } from "../services/document.service";
import { EmbeddingService } from "../services/AI/embedding.service";
import * as fs from 'fs/promises';

export class DocumentController {
  constructor(
    private docService: DocumentService,
    private embeddingService: EmbeddingService
  ) {}

  async upload(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file provided" });
      return;
    }

    try {
      // Upload và lưu file
      const fileName = await this.docService.uploadAndSave(
        req.file.path,
        req.file.originalname,
        1 // Giả sử adminId = 1
      );

      // Embedding async (background, nhưng tốt hơn dùng queue như BullMQ cho production)
      this.embeddingService.embedDocument(fileName)
        .catch(error => console.error('Background embedding failed:', error));

      res.json({ success: true, message: "Upload successful", fileName });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    } finally {
      // Cleanup temp file luôn
      await fs.unlink(req.file.path).catch(() => {});
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { fileName } = req.params;
    try {
      await this.docService.deleteDocument(fileName);
      await this.embeddingService.deleteEmbeddingsByFileName(fileName);
      res.json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    try {
      const result = await this.docService.listDocuments(page, pageSize);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}