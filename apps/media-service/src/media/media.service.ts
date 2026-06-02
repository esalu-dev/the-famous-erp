// src/media/media.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CLIENT_TOKEN } from 'src/storage-module/storage-module.module';

@Injectable()
export class MediaService {
  private bucketName = process.env.R2_BUCKET_NAME;
  private publicUrl = process.env.R2_PUBLIC_URL;

  constructor(@Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client) {}

  async generateUploadUrl(fileName: string) {
    // Generar un nombre único usando el timestamp actual + un número aleatorio
    // Esto evita conflictos si suben dos imágenes llamadas "pizza.jpg"
    const parts = fileName.split('.');
    const fileExtension = parts.length > 1 ? parts.pop()?.toLowerCase() : 'jpeg';
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const uniqueKey = `insumos/${uniqueId}.${fileExtension}`;

    // Configurar el comando para indicarle a R2 qué archivo vamos a subir
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueKey,
      ContentType: `image/${fileExtension}`, // Crucial para que el navegador lo muestre en lugar de descargarlo
    });

    // Generar la URL firmada. Le daremos 3 minutos (180 segundos) de validez
    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 180 });

    console.log('comando configurado');
    // La URL limpia que usarás en las cards del Frontend
    const finalFileUrl = `${this.publicUrl}/${uniqueKey}`;

    return {
      uploadUrl,
      finalFileUrl,
    };
  }

  async deleteFileByUrl(fileUrl: string) {
    if (!fileUrl) return { success: false };

    const prefix = `${this.publicUrl}/`;
    if (!fileUrl.startsWith(prefix)) {
      throw new BadRequestException('La URL del archivo no pertenece a este bucket');
    }

    const fileKey = fileUrl.replace(prefix, '');

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    await this.s3Client.send(command);
    return { success: true };
  }
}
