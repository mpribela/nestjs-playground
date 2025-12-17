import {AbstractClient} from './abstract.client';
import {Injectable, Logger, NotFoundException,} from '@nestjs/common';
import {BlobServiceClient} from '@azure/storage-blob';

@Injectable()
export class AzureClient implements AbstractClient {
  private readonly logger = new Logger(AzureClient.name);
  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerName: string;

  constructor() {
    if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
      this.blobServiceClient = BlobServiceClient.fromConnectionString(
          process.env.AZURE_STORAGE_CONNECTION_STRING,
      );
    } else {
      this.logger.fatal('Please define AZURE_STORAGE_CONNECTION_STRING');
      throw new Error('Could not create connection to Azure');
    }
    if (process.env.AZURE_CONTAINER_NAME) {
      this.logger.error('Please define AZURE_CONTAINER_NAME');
    }
    this.blobServiceClient
        .getContainerClient('test-container')
        .exists()
        .then(() => {
          this.logger.log('Azure Client connected');
        })
        .catch((err) => {
          this.logger.fatal('Could not connect to Azure Client', err);
          throw new Error('Could not connect to Azure client');
        });
    this.containerName = process.env.AZURE_CONTAINER_NAME!;
  }

  async getFileContentType(fileName: string): Promise<string> {
    const blobClient = this.blobServiceClient
        .getContainerClient(this.containerName)
        .getBlobClient(fileName);
    if (!(await blobClient.exists())) {
      throw new NotFoundException(
          `Could not get file content type of ${fileName}`,
      );
    }
    const properties = await blobClient.getProperties();
    return properties.contentType ?? 'unknown content type';
  }
}
