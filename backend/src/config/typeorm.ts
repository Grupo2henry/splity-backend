/* eslint-disable prettier/prettier */
// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Fuerza la carga del archivo de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env.development') });
/*console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
});*/
dotenv.config({ path: path.resolve(__dirname, '../../.env.development') });

console.log('DB_USERNAME cargado:', process.env.DB_USERNAME);

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_PUBLIC_URL,
  autoLoadEntities: true,
  dropSchema: true,
  synchronize: true,
  logging: false,
  ssl: false, // ponelo en true para prod con SSL
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
};

// Para CLI de migraciones (no incluye autoLoadEntities)
export const connectionSource = new DataSource(dbConfig as DataSourceOptions);
