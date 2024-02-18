import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(MainModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Taskify Pro')
    .setDescription(
      'Task Manager Application API documentation. This application allows users to manage their tasks effectively, including creating, viewing, updating, and deleting tasks.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurity('refresh_token', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Use this to set the refresh token as a Bearer token',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }
  await app.listen(port, '0.0.0.0');
}
bootstrap();
