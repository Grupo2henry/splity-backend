/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
          url: 'https://localhost:3000',
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
