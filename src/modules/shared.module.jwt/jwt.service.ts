// import { Global, Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// @Global()
// @Module({
//   imports: [
//     ConfigModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         const secret = configService.get<string>('JWT_KEY');
//         if (!secret) {
//           throw new Error('no hay secret');
//         }
//         return { secret, signOptions: { expiresIn: '1h' } };
//       },
//     }),
//   ],
//   exports: [JwtModule],
// })
// export class SharedModule {}
