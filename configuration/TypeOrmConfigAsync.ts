import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export default class TypeOrmConfig {
  static getOrmConfig(config: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      username: config.get('DB_USER'),
      password: config.get('DB_PWD'),
      database: config.get('DB_DB'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      ssl: process.env.NODE_ENV === 'production'
     ? { rejectUnauthorized: false }
     : false,
    };
  }
}

// ssl:
// process.env.NODE_ENV === 'production'
//     ? { rejectUnauthorized: false }
//     : false,

export const TypeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> =>
    TypeOrmConfig.getOrmConfig(config),
  inject: [ConfigService],
};
// dataSourceFactory: async (options) => {
//     const dataSource = await new DataSource(options).initialize();
//     return dataSource;
// },

// return {
//     type: 'mysql',
//     host: config.get<number>('DB_HOST') + '',
//     port: config.get<number>('DB_PORT'),
//     username: config.get<string>('DB_USER'),
//     password: config.get<string>('DB_PWD'),
//     database: config.get<string>('DB_DB'),
//     entities: ["dist/**/*.entity{.ts,.js}"],
//     synchronize: true,
//     autoLoadEntities: true,
// }

// return {
//     type: 'mysql',
//     host: 'MYSQL5037.site4now.net',
//     port: 3306,
//     username: 'a7bde6_roots',
//     password: 'root@2022',
//     database: 'db_a7bde6_roots',
//     entities: ["dist/**/*.entity{.ts,.js}"],
//     synchronize: true,
//     autoLoadEntities: true,
// }
