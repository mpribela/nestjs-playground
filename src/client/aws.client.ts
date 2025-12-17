import {
  GetObjectCommand,
  ListObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { AbstractClient } from './abstract.client';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AwsClient implements AbstractClient {
  private readonly logger = new Logger(AwsClient.name);
  private readonly s3Client: S3Client;

  constructor() {
    this.logger.log('Initialising AWS client');
    this.s3Client = new S3Client({
      forcePathStyle: true,
      apiVersion: 'latest',
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY ?? 'test',
        secretAccessKey: process.env.AWS_SECRET_KEY ?? 'test',
      },
    });
    this.s3Client
      .send(new ListObjectsCommand({ Bucket: 'test-bucket', MaxKeys: 1 }))
      .then(() => this.logger.log('AWS client initialised successfully'))
      .catch(() => {
        this.logger.fatal('AWS client initialisation failed');
        throw new Error('Could not connect to AWS client');
      });
  }

  async getFileContentType(fileName: string): Promise<string> {
    try {
      const { ContentType } = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: 'test-bucket',
          Key: fileName,
        }),
      );
      return ContentType ?? 'unknown content type';
    } catch (error) {
      if (error.name === 'NoSuchKey') {
        throw new NotFoundException(
          `Could not get file content type of ${fileName}`,
        );
      }
      this.logger.error(
        'Unknown error occurred during fetching file content',
        error,
      );
      throw new InternalServerErrorException();
    }
  }
}
