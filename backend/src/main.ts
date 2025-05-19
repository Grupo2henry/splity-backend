/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middleware/global-loger-middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    //const client = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
    app.use(loggerGlobal);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors({
      /*origin: [
        'http://172.22.240.1:3000/',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://172.22.240.1:3000',
        'https://9728-181-4-211-243.ngrok-free.app',
        'https://real-years-draw.loca.lt',
      ], // Reemplaza con la URL del cliente en produccion*/
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Splity')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const port = process.env.PORT || 4000;
    SwaggerModule.setup('api', app, document);
    await app.listen(port);
    console.log(` Servidor corriendo en puerto: ${port}`);
  } catch (error) {
    console.error(' Error al iniciar el servidor:', error);
  }
}
void bootstrap();
