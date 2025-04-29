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
