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
      origin: [client, 'http://localhost:5173'], // Reemplaza con la URL del cliente
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true, // Si necesitas enviar cookies o encabezados de autenticación
    })

    const config = new DocumentBuilder()
      .setTitle('Splity')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
    console.log(` Servidor corriendo en http://localhost:3000`);
  } catch (error) {
    console.error(' Error al iniciar el servidor:', error);
  }
}
bootstrap();
