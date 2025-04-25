/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log("Esta es la rama gonzalo-prueba");
    console.log("Nuevo log para dev-prueba")
    return this.appService.getHello();

  }
}
