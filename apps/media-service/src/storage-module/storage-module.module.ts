// src/storage/storage.module.ts
import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';

export const S3_CLIENT_TOKEN = 'S3_CLIENT';

@Module({
  providers: [
    {
      provide: S3_CLIENT_TOKEN,
      useFactory: () => {
        return new S3Client({
          region: 'auto', // R2 requiere estrictamente 'auto'
          endpoint: process.env.R2_ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
          },
        });
      },
    },
  ],
  exports: [S3_CLIENT_TOKEN],
})
export class StorageModule {}
