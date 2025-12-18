import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import {AbstractClient} from './abstract.client';
import {Injectable, InternalServerErrorException, Logger, NotFoundException,} from '@nestjs/common';
import {randomUUID} from 'node:crypto';

@Injectable()
export class AwsClient implements AbstractClient {
  private readonly logger = new Logger(AwsClient.name);
  private readonly s3Client: S3Client;

  constructor() {
    if (!process.env.AWS_ACCESS_KEY) {
      this.logger.fatal('AWS_ACCESS_KEY environment variable is missing.');
      throw new Error('AWS_ACCESS_KEY environment variable is missing.');
    }
    if (!process.env.AWS_SECRET_KEY) {
      this.logger.fatal('AWS_SECRET_KEY environment variable is missing.');
      throw new Error('AWS_SECRET_KEY environment variable is missing.');
    }
    this.logger.log('Initialising AWS client.');
    this.s3Client = new S3Client({
      forcePathStyle: true,
      apiVersion: 'latest',
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
    this.s3Client
        .send(
            new ListObjectsCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              MaxKeys: 1,
            }),
        )
        .then(() => this.logger.log('AWS client initialised successfully.'))
      .catch(() => {
        this.logger.fatal('AWS client initialisation failed.');
        throw new Error('Could not connect to AWS client.');
      });
  }

  async uploadFile(file: Express.Multer.File): Promise<void> {
    const fileName = file.originalname ?? `${randomUUID()}.png`;
    try {
      await this.s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
          }),
      );
      this.logger.log(`File ${fileName} uploaded successfully.`);
    } catch (error) {
      this.logger.error(
          `Unknown error occurred during uploading of file ${fileName}.`,
          error,
      );
      throw new InternalServerErrorException();
    }
  }

  async getFileContentType(fileName: string): Promise<string> {
    try {
      const { ContentType } = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
        }),
      );
      return ContentType ?? 'unknown content type';
    } catch (error) {
      if (error instanceof S3ServiceException && error.name === 'NoSuchKey') {
        throw new NotFoundException(
            `Could not get file content type of ${fileName}.`,
        );
      }
      this.logger.error(
          'Unknown error occurred during fetching file content.',
        error,
      );
      throw new InternalServerErrorException();
    }
  }
}
