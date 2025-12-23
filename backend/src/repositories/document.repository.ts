import { Repository, DataSource } from 'typeorm';
import { Document } from '../entities/Document';

export class DocumentRepository {
  private repository: Repository<Document>;

  constructor(datasource: DataSource) {
    this.repository = datasource.getRepository(Document);
  }

  async create(document: Partial<Document>): Promise<Document> {
    return this.repository.save(document);
  }

  async findById(id: number): Promise<Document | null> {
    return this.repository.findOneBy({ id });
  }

  async findByFileName(fileName: string): Promise<Document | null> {
    return this.repository.findOneBy({ fileName });
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<{ documents: Document[], total: number, page: number, pageSize: number }> {
    const [documents, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
      select: ['id', 'fileName', 'originalName', 'uploadedBy', 'embedded', 'createdAt'], // Không select path để tránh lộ thông tin nhạy cảm
    });
    return { documents, total, page, pageSize };
  }

  async deleteByFileName(fileName: string): Promise<boolean> {
    const result = await this.repository.delete({ fileName });
    return (result.affected ?? 0) > 0;
  }

  async updateEmbeddedStatus(fileName: string, embedded: boolean): Promise<void> {
    await this.repository.update({ fileName }, { embedded });
  }

  async getFilePath(fileName: string): Promise<string | null> {
    const doc = await this.findByFileName(fileName);
    return doc?.path || null;
  }
}