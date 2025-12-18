import {Inject, Injectable} from '@nestjs/common';
import {AbstractClient} from '../client/abstract.client';

@Injectable()
export class FileService {
  constructor(@Inject('CLIENT') private readonly cloudClient: AbstractClient) {}

  async getFileContentType(fileName: string): Promise<string> {
    return await this.cloudClient.getFileContentType(fileName);
  }

  async uploadFile(file: Express.Multer.File) {
    await this.cloudClient.uploadFile(file);
  }
}
