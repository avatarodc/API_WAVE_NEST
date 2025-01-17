import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurer les pipes de validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const configService = app.get(ConfigService);
  const jwtSecret = configService.get<string>('JWT_SECRET');

  // Configurer Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Documentation de l’API pour mon projet NestJS')
    .setVersion('1.0')
    .addBearerAuth() // Ajout de l'authentification JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Swagger accessible sur /api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
