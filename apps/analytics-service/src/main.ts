import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const httpPort = Number(process.env.ANALYTICS_SERVICE_PORT) || 3003;
  const tcpPort = Number(process.env.ANALYTICS_SERVICE_TCP_PORT) || 3006;

  const app = await NestFactory.create(AppModule);

  // Enable CORS so that frontend requests can be processed successfully
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();
  console.log(`[Analytics Service] Microservice is listening on TCP port ${tcpPort}`);

  await app.listen(httpPort);
  console.log(`[Analytics Service] HTTP REST API is listening on port ${httpPort}`);
}
void bootstrap();

