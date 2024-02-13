import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  await app.listen(3000);
}
bootstrap();
