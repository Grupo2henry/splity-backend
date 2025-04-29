import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './midleware/global-loger-middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(loggerGlobal);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
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
