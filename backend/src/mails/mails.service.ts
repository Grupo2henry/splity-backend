/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailUser } from '../user/interfaces/email-user.interface';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: EmailUser) {
    console.log('Iniciando envío...');

    try {
      const result = await this.mailerService.sendMail({
        to: user.email,
        subject: 'Bienvenido a Splity!',
        template: './welcome',
        context: {
          name: user.name,
          url: process.env.CLIENT_URL,
        },
      });

      console.log('Resultado del envío:', result);
      return true;
    } catch (error) {
      console.error('Error al enviar:', error);
      return false;
    }
  }
}
