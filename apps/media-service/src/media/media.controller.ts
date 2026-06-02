import { BadRequestException, Controller, Get, Param, Delete, Body } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('upload-url/:fileName')
  async getUploadUrl(@Param('fileName') fileName: string) {
    if (!fileName) {
      throw new BadRequestException('El nombre del archivo es requerido');
    }
    return await this.mediaService.generateUploadUrl(fileName);
  }

  @Delete('file')
  async deleteFile(@Body('fileUrl') fileUrl: string) {
    if (!fileUrl) {
      throw new BadRequestException('La URL del archivo es requerida');
    }
    return await this.mediaService.deleteFileByUrl(fileUrl);
  }
}
