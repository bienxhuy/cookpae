import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { DocumentRepository } from '../../repositories/document.repository';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import * as path from 'path';
import * as fs from 'fs/promises';

export class EmbeddingService {
  private embeddings: HuggingFaceTransformersEmbeddings;
  private vectorStore: FaissStore | null = null;
  private readonly VECTOR_STORE_PATH: string;

  constructor(private docRepo: DocumentRepository) {
    this.VECTOR_STORE_PATH = path.join(process.cwd(), 'storage', 'vector_db');
    this.embeddings = new HuggingFaceTransformersEmbeddings({
      model: "Xenova/all-MiniLM-L6-v2",
    });
    this.ensureVectorStoreDirectory();
  }

  private async ensureVectorStoreDirectory(): Promise<void> {
    const dir = path.dirname(this.VECTOR_STORE_PATH);
    await fs.mkdir(dir, { recursive: true });
  }

  private async loadVectorStore(): Promise<void> {
    console.log(`🔍 Attempting to load vector store from: ${this.VECTOR_STORE_PATH}`);

    const filesToCheck = [
      'faiss.index',
      'index.faiss',
      'docstore.json',
      'docstore.pkl',
    ];

    const existingFiles = [];
    for (const file of filesToCheck) {
      const fullPath = path.join(this.VECTOR_STORE_PATH, file);
      if (await fs.stat(fullPath).catch(() => false)) {
        existingFiles.push(file);
      }
    }

    console.log(`   Existing files in vector_db: ${existingFiles.join(', ') || 'NONE'}`);

    if (existingFiles.length === 0) {
      console.warn(`❌ No vector store files found in ${this.VECTOR_STORE_PATH}`);
      this.vectorStore = null;
      return;
    }

    try {
      this.vectorStore = await FaissStore.load(this.VECTOR_STORE_PATH, this.embeddings);
      console.log(`✅ Vector store LOADED successfully! Contains documents.`);
    } catch (error: any) {
      console.error(`❌ FAILED to load vector store:`, error.message);
      console.error(`   This usually happens due to version mismatch or corrupted files.`);
      this.vectorStore = null;
    }
  }
  private async extractTextFromPDF(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath, { splitPages: false });
    const docs = await loader.load();
    const text = docs.map(doc => doc.pageContent).join('\n\n').trim();

    if (!text || text.length < 10) {
      throw new Error('No text content could be extracted from PDF');
    }

    console.log(`Extracted ${text.length} characters from PDF`);
    return text;
  }

  async embedDocument(fileName: string): Promise<void> {
    const filePath = await this.docRepo.getFilePath(fileName);
    if (!filePath) throw new Error('File path not found');

    try {
      // Extract text
      const textContent = await this.extractTextFromPDF(filePath);

      // Split thành chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });
      const chunks = await splitter.splitText(textContent);
      console.log(`Split into ${chunks.length} chunks`);

      // Tạo documents với metadata để mapping chunk dễ dàng (ví dụ: thêm chunkIndex)
      const docs = chunks.map((chunk, index) => ({
        pageContent: chunk,
        metadata: { fileName, chunkIndex: index, source: fileName },
      }));

      // Load hoặc tạo vector store
      await this.loadVectorStore();
      if (!this.vectorStore) {
        this.vectorStore = await FaissStore.fromDocuments(docs, this.embeddings);
      } else {
        await this.vectorStore.addDocuments(docs);
      }

      // Lưu vector store
      await this.vectorStore.save(this.VECTOR_STORE_PATH);

      // Update status
      await this.docRepo.updateEmbeddedStatus(fileName, true);
      console.log(`Embedded successfully: ${fileName}`);
    } catch (error) {
      console.error(`Embedding failed for ${fileName}:`, error);
      throw error;
    }
  }

  async searchSimilar(query: string, k: number = 3): Promise<any[]> {
    await this.loadVectorStore();
    if (!this.vectorStore) {
      console.log("⚠️ Vector store not loaded or empty");
      return [];
    }

    console.log(`🔍 Searching for: "${query}" (k=${k})`);
    const results = await this.vectorStore.similaritySearch(query, k);
    

    return results;
  }

  async deleteEmbeddingsByFileName(fileName: string): Promise<void> {
    // FAISS không hỗ trợ delete trực tiếp theo metadata, cần rebuild store
    // Để cơ bản, có thể skip hoặc implement rebuild nếu cần
    console.warn(`Deletion of embeddings for ${fileName} not implemented. Consider rebuilding vector store.`);
  }
}