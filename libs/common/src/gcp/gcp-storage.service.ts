import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { FileType } from '../enums/file-type.enum';

@Injectable()
export class GcpStorageService {
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get<string>('GCP_PROJECT_ID'),
      keyFilename: this.configService.get<string>('GCP_KEY_FILE_PATH'),
    });
    this.bucketName = this.configService.get<string>('GCP_STORAGE_BUCKET');
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<string> {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(fileName);

    try {
      await blob.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        public: true,
      });

      return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    } catch (error) {
      throw new Error(`Failed to upload file to GCP: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = this.extractFileNameFromUrl(fileUrl);
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    try {
      await file.delete();
    } catch (error) {
      throw new Error(`Failed to delete file from GCP: ${error.message}`);
    }
  }

  async generateSignedUrl(
    fileName: string,
    folder: string = 'uploads',
    expiresIn: number = 3600,
  ): Promise<string> {
    const fullFileName = `${folder}/${fileName}`;
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fullFileName);

    try {
      const [url] = await file.getSignedUrl({
        action: 'write',
        expires: Date.now() + expiresIn * 1000,
        contentType: 'application/octet-stream',
      });
      return url;
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  async getPublicUrl(fileName: string, folder: string = 'uploads'): Promise<string> {
    const fullFileName = `${folder}/${fileName}`;
    return `https://storage.googleapis.com/${this.bucketName}/${fullFileName}`;
  }

  private extractFileNameFromUrl(fileUrl: string): string {
    const url = new URL(fileUrl);
    return url.pathname.substring(1); // Remove leading slash
  }

  getFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType.startsWith('video/')) return FileType.VIDEO;
    if (mimeType.startsWith('audio/')) return FileType.AUDIO;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileType.DOCUMENT;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return FileType.ARCHIVE;
    return FileType.DOCUMENT;
  }
}
