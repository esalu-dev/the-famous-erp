import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
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
}
