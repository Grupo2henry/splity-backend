import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './midleware/global-loger-middleware';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(loggerGlobal);
    await app.listen(3000);
    console.log(` Servidor corriendo en http://localhost:3000`);
  } catch (error) {
    console.error(' Error al iniciar el servidor:', error);
  }
}
bootstrap();
