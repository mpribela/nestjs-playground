import {AbstractClient} from './abstract.client';
import {Injectable, InternalServerErrorException, Logger, NotFoundException,} from '@nestjs/common';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
import {randomUUID} from 'node:crypto';

@Injectable()
export class AzureClient implements AbstractClient {
  private readonly logger = new Logger(AzureClient.name);
  private readonly containerClient: ContainerClient;

  constructor() {
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      this.logger.fatal('Please define `AZURE_STORAGE_CONNECTION_STRING`.');
      throw new Error('Could not create connection to Azure.');
    }
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    if (!process.env.AZURE_CONTAINER_NAME) {
      this.logger.error('Please define `AZURE_CONTAINER_NAME`.');
      throw new Error('Could not create connection to Azure.');
    }
    this.containerClient = blobServiceClient.getContainerClient(
        process.env.AZURE_CONTAINER_NAME,
    );
    this.containerClient
        .exists()
        .then(() => {
          this.logger.log('Azure Client connected.');
        })
        .catch((err) => {
          this.logger.fatal('Could not connect to Azure Client.', err);
          throw new Error('Could not connect to Azure client.');
        });
  }

  async uploadFile(file: Express.Multer.File): Promise<void> {
    const fileName = file.filename ?? `${randomUUID()}.png`;
    try {
      await this.containerClient
          .getBlockBlobClient(fileName)
          .uploadStream(file.stream);
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
    const blobClient = this.containerClient.getBlobClient(fileName);
    if (!(await blobClient.exists())) {
      throw new NotFoundException(
          `Could not get file content type of ${fileName}.`,
      );
    }
    const properties = await blobClient.getProperties();
    return properties.contentType ?? 'unknown content type';
  }
}
