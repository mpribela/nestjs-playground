import {
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {FileInfoDto} from '../dto/fileInfoDto';
import {FileService} from '../service/file.service';
import {FileInterceptor} from '@nestjs/platform-express';

@Controller('file')
export class CloudController {
  constructor(@Inject() private readonly fileService: FileService) {}

  @Get(':fileName')
  async getFileInfo(@Param('fileName') fileName: string): Promise<FileInfoDto> {
    const contentType = await this.fileService.getFileContentType(fileName);
    return {
      fileName: fileName,
      contentType: contentType,
    };
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
      @UploadedFile(
          new ParseFilePipe({
            validators: [new FileTypeValidator({fileType: 'image/png'})],
          }),
      )
      file: Express.Multer.File,
  ): Promise<FileInfoDto> {
    await this.fileService.uploadFile(file);
    return {
      fileName: file.filename,
      contentType: file.mimetype,
    };
  }
}
