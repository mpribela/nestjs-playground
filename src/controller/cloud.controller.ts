import { Controller, Get, Inject, Param } from '@nestjs/common';
import { FileInfoDto } from '../dto/fileInfoDto';
import { FileService } from '../service/file.service';

@Controller('file')
export class CloudController {
  constructor(@Inject() private readonly fileService: FileService) {}

  @Get(':fileName')
  async getFileInfo(@Param('fileName') fileName: string): Promise<FileInfoDto> {
    return {
      fileName: fileName,
      contentType: await this.fileService.getFileContentType(fileName),
    };
  }
}
