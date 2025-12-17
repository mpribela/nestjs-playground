export abstract class AbstractClient {
  abstract getFileContentType(fileName: string): Promise<string>;
}
