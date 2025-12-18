export abstract class AbstractClient {
  abstract getFileContentType(fileName: string): Promise<string>;

  abstract uploadFile(file: Express.Multer.File): Promise<void>;
}
