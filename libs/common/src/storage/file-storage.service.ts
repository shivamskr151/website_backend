import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { FileType } from '../enums/file-type.enum';

@Injectable()
export class FileStorageService {
  private uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<string> {
    const fileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    const folderPath = path.join(this.uploadDir, folder);
    const filePath = path.join(folderPath, fileName);

    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save file
    fs.writeFileSync(filePath, file.buffer);
    return fileName;
  }

  async saveImageWithThumbnail(
    file: Express.Multer.File,
    folder: string = 'images',
  ): Promise<{ original: string; thumbnail: string }> {
    const fileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    const folderPath = path.join(this.uploadDir, folder);
    const filePath = path.join(folderPath, fileName);
    const thumbnailPath = path.join(folderPath, `thumb-${fileName}`);

    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save original image
    fs.writeFileSync(filePath, file.buffer);

    // Create thumbnail
    await sharp(file.buffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return {
      original: fileName,
      thumbnail: `thumb-${fileName}`,
    };
  }

  async deleteFile(fileName: string, folder: string = 'uploads'): Promise<void> {
    const filePath = path.join(this.uploadDir, folder, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async getFileStream(fileName: string, folder: string = 'uploads'): Promise<fs.ReadStream> {
    const filePath = path.join(this.uploadDir, folder, fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return fs.createReadStream(filePath);
  }

  async getFileInfo(fileName: string, folder: string = 'uploads'): Promise<{
    size: number;
    mimeType: string;
    lastModified: Date;
  }> {
    const filePath = path.join(this.uploadDir, folder, fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const stats = fs.statSync(filePath);
    const mimeType = this.getMimeType(fileName);

    return {
      size: stats.size,
      mimeType,
      lastModified: stats.mtime,
    };
  }

  getFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType.startsWith('video/')) return FileType.VIDEO;
    if (mimeType.startsWith('audio/')) return FileType.AUDIO;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileType.DOCUMENT;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return FileType.ARCHIVE;
    return FileType.DOCUMENT;
  }

  private getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
