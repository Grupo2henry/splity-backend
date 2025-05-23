/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailUser } from '../user/interfaces/email-user.interface';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailsService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  async sendUserConfirmation(user: EmailUser) {
    console.log('Iniciando envío...');

    try {
      const result = await this.mailerService.sendMail({
        to: user.email,
        subject: 'Bienvenido a Splity!',
        template: './welcome',
        context: {
          name: user.name,
          url: this.configService.get<string>('URL_PAGE'),
        },
      });

      console.log('Resultado del envío:', result);
      return true;
    } catch (error) {
      console.error('Error al enviar:', error);
      return false;
    }
  }
  sendGruopConfirmation(users: User[], nameGroup: string) {
    console.log('Iniciando envío a grupos');

    // Crear un arreglo de promesas
    const emailPromises = users.map((user) => {
      return this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Bienvenido al nuevo grupo',
          template: './group',
          context: {
            nameGroup: nameGroup,
            name: user.name,
            url: this.configService.get<string>('URL_PAGE'),
          },
        })
        .then((result) => {
          console.log('Resultado del envío a', user.email, ':', result);
        })
        .catch((error) => {
          console.error('Error al enviar a', user.email, ':', error);
        });
    });

    // Espera a que todas las promesas se resuelvan
    return Promise.all(emailPromises)
      .then(() => {
        console.log('Todos los envíos realizados');
        return true;
      })
      .catch(() => {
        console.error('Hubo un error al enviar algunos correos');
        return false;
      });
  }

  async sendPasswordRecoveryEmail(user: EmailUser) {
  console.log('Enviando email de recuperación...');
  console.log(this.configService.get<string>('CLIENT_URL'));
  const clientUrl = this.configService.get<string>('CLIENT_URL');
    try {
      const result = await this.mailerService.sendMail({
        to: user.email,
        subject: 'Recuperación de contraseña - Splity',
        template: './password-recovery',
        context: {
          name: user.name,
          email: user.email,
          url: `${clientUrl}/ResetPassword`, 
        },
      });

      console.log('Email de recuperación enviado:', result);
      return true;
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error);
      return false;
    }
  }
}
