import { Router } from 'express';
import multer from 'multer';
import { DocumentController } from '../controllers/document.controller';
import { DocumentService } from '../services/document.service';
import { EmbeddingService } from '../services/AI/embedding.service';
import { AppDataSource } from '../data-source'; 
import { DocumentRepository } from '../repositories/document.repository';

const documentRepository = new DocumentRepository(AppDataSource);
const documentService = new DocumentService(documentRepository);
const embeddingService = new EmbeddingService(documentRepository);
const documentController = new DocumentController(documentService, embeddingService);

const upload = multer({ dest: 'uploads/' }); // Temp folder
const documentRouter = Router();

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Upload tài liệu (PDF, Word, v.v.)
 *     description: Upload một file tài liệu, hệ thống sẽ trích xuất nội dung, lưu trữ và tự động tạo embedding cho RAG.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File tài liệu cần upload
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Upload thành công
 *                 fileName:
 *                   type: string
 *                   description: Tên file đã được lưu trong hệ thống
 *                   example: 20251220_abc123_document.pdf
 *       400:
 *         description: Thiếu file upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Thiếu file
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
documentRouter.post('/upload', upload.single('file'), (req, res) => documentController.upload(req, res));

/**
 * @swagger
 * /api/documents/{fileName}:
 *   delete:
 *     summary: Xóa tài liệu theo fileName
 *     description: Xóa file tài liệu khỏi storage và xóa các embedding tương ứng.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên file đã được lưu khi upload
 *         example: 20251220_abc123_document.pdf
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Xóa thành công
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
documentRouter.delete('/:fileName', (req, res) => documentController.delete(req, res));

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Liệt kê danh sách tài liệu đã upload
 *     description: Trả về danh sách tài liệu với phân trang.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *         example: 1
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Kết quả phân trang (cấu trúc tùy thuộc vào service)
 *       500:
 *         description: Lỗi server
 */
documentRouter.get('/', (req, res) => documentController.list(req, res));


export default documentRouter;