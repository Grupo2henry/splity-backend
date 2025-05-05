/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './midleware/global-loger-middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const client = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
    app.use(loggerGlobal);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors({
      origin: [
        client,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://172.22.240.1:3000',
        'https://27a0-2803-9800-98c5-a8c-c49b-6af8-fc85-6d76.ngrok-free.app',
      ], // Reemplaza con la URL del cliente
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true, // Si necesitas enviar cookies o encabezados de autenticación
    });

    const config = new DocumentBuilder()
      .setTitle('Splity')
      .setVersion('1.0')
      .addBearerAuth() // Add Bearer Auth for Swagger
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(4000);
    console.log(` Servidor corriendo en http://localhost:4000`);
  } catch (error) {
    console.error(' Error al iniciar el servidor:', error);
  }
}
bootstrap();
