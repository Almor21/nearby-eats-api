import { DataSource } from 'typeorm';
import entities from './entities';
import { configDotenv } from 'dotenv';

configDotenv();

let AppDataSource: DataSource;

if (process.env.NODE_ENV === 'docker') {
  AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || '',
    entities: entities,
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
  });
} else {
  AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'db',
    entities: entities,
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
  });
}

export default AppDataSource;
