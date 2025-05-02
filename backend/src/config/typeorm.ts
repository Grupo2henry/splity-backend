/* eslint-disable prettier/prettier */
// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env.development') });

console.log('DB_USERNAME cargado:', process.env.DB_USERNAME);
export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_PUBLIC_URL,
  // database: process.env.DB_NAME,
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  //sdf
  autoLoadEntities: true,
  dropSchema: false, //Poner en true llegado el caso
  synchronize: true,
  logging: false,
  ssl: false, // ponelo en true para prod con SSL
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
};

// Para CLI de migraciones (no incluye autoLoadEntities)
export const connectionSource = new DataSource(dbConfig as DataSourceOptions);
