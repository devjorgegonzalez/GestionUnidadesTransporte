import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Prefijo global de API
  app.setGlobalPrefix('api/v1');

  // Filtro de excepciones estándar
  app.useGlobalFilters(new AllExceptionsFilter());

  // Interceptor de respuesta estándar
  app.useGlobalInterceptors(new TransformInterceptor());

  // Validación global estricta
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de CORS
  const corsOrigin =
    configService.get<string>('CORS_ORIGIN') || 'http://localhost:10101';
  app.enableCors({
    origin: corsOrigin.includes(',') ? corsOrigin.split(',') : corsOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Configuración de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Gestión de Unidades de Transporte')
    .setDescription(
      'Documentación interactiva de la API REST para el control de flota, conductores, reservas, mantenimientos y tracking GPS.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el Bearer Token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Documentación API — Gestión UT',
  });

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
  logger.log(`Backend iniciado en el puerto ${port}`);
  logger.log(`Documentación Swagger expuesta en http://localhost:${port}/api/docs`);
}

bootstrap();
