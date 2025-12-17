import { AbstractClient } from './abstract.client';
import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AzureClient implements AbstractClient {
  async getFileContentType(fileName: string): Promise<string> {
    throw new NotImplementedException('Azure is not implemented.');
  }
}
