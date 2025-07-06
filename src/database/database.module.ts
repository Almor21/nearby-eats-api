import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './entities';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (config.get('NODE_ENV') === 'docker') {
          return {
            type: 'postgres',
            url: config.get('DATABASE_URL', ''),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
          };
        }
        return {
          type: 'postgres',
          host: config.get('DB_HOST', ''),
          port: parseInt(config.get('DB_PORT', '')),
          username: config.get('DB_USERNAME', ''),
          password: config.get('DB_PASSWORD', ''),
          database: config.get('DB_NAME', ''),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
