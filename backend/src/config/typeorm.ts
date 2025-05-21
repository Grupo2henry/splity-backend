/* eslint-disable prettier/prettier */
// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env.development') });

console.log('DB_USERNAME cargado:', process.env.DB_USERNAME);
let dropSchemaDB = false;

if (process.env.DROP_SCHEMA === 'false') {
  dropSchemaDB = false;
} else if (process.env.DROP_SCHEMA === 'true') {
  dropSchemaDB = true;
} else {
  dropSchemaDB = true;
}

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_PUBLIC_URL,
  /*database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,*/
  autoLoadEntities: true,
  dropSchema: dropSchemaDB,
  synchronize: false,
  logging: false,
  ssl: false,
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
};

// Para CLI de migraciones (no incluye autoLoadEntities)
export const connectionSource = new DataSource(dbConfig as DataSourceOptions);
