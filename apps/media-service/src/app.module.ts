import { Module } from '@nestjs/common';

import { StorageModule } from './storage-module/storage-module.module';
import { MediaService } from './media/media.service';
import { MediaController } from './media/media.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), StorageModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class AppModule {}
