import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { FileType } from '../enums/file-type.enum';

@Injectable()
export class AwsService {
  private s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<string> {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');

    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const key = this.extractKeyFromUrl(fileUrl);

    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      throw new Error(`Failed to delete file from S3: ${error.message}`);
    }
  }

  async generatePresignedUrl(
    fileName: string,
    folder: string = 'uploads',
    expiresIn: number = 3600,
  ): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const key = `${folder}/${fileName}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn,
      Conditions: [
        ['content-length-range', 0, 10485760], // 10MB max
        ['starts-with', '$Content-Type', 'image/'],
      ],
    };

    try {
      const presignedPost = await this.s3.createPresignedPost(params);
      return presignedPost.url;
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  private extractKeyFromUrl(fileUrl: string): string {
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
