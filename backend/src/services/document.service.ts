import * as fs from 'fs/promises';
import * as path from 'path';
import { DocumentRepository } from '../repositories/document.repository';

export class DocumentService {
  private readonly STORAGE_PATH: string;

  constructor(private docRepo: DocumentRepository) {
    this.STORAGE_PATH = path.join(process.cwd(), 'storage', 'documents');
    this.ensureStorageDirectory(); 
  }

  private async ensureStorageDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.STORAGE_PATH, { recursive: true });
    } catch (error) {
      console.error('Error creating storage directory:', error);
    }
  }

  async uploadAndSave(tempPath: string, originalName: string, uploadedBy: number): Promise<string> {
    if (!originalName.toLowerCase().endsWith('.pdf')) {
      throw new Error('Only PDF files are supported');
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}_${randomStr}_${originalName.replace(/\s/g, '_')}`; // Thay space bằng underscore

    const storagePath = path.join(this.STORAGE_PATH, fileName);

    try {
      await fs.rename(tempPath, storagePath);

      await this.docRepo.create({
        fileName,
        originalName,
        path: storagePath,
        uploadedBy,
        embedded: false,
      });

      console.log(`Saved document: ${fileName}`);
      return fileName;
    } catch (error) {
      // Cleanup nếu lỗi
      if (await fs.stat(storagePath).catch(() => false)) {
        await fs.unlink(storagePath);
      }
      throw error;
    }
  }

  async deleteDocument(fileName: string): Promise<void> {
    const doc = await this.docRepo.findByFileName(fileName);
    if (!doc) throw new Error('Document not found');

    await fs.unlink(doc.path).catch(() => console.warn(`File not found: ${doc.path}`));

    // Xóa DB
    await this.docRepo.deleteByFileName(fileName);
  }

  async listDocuments(page: number, pageSize: number = 10): Promise<{ documents: any[], total: number, page: number, pageSize: number }> {
    return this.docRepo.findAll(page, pageSize);
  }

  getFilePath(fileName: string): string {
    return path.join(this.STORAGE_PATH, fileName);
  }
}