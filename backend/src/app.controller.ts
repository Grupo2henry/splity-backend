/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log("Esta es la rama gonzalo-prueba");
    console.log("Otra prueba de gonzalo")
    console.log("Nuevo log para dev-prueba")
    console.log("Cambio pequeño")
    return this.appService.getHello();

  }
}
