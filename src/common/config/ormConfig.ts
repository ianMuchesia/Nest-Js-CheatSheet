import { join } from "path";

// ormConfig.ts
export function ormConfig(): any {
    return {
        type: process.env.TYPEORM_CONNECTION,
        host: process.env.TYPEORM_HOST,
        port: Number(process.env.TYPEORM_PORT),
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        autoLoadEntities: true,
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        logging: false,
        synchronize: true,
        //If you don't want synchronize automatically, you need consider use cli to make the migrations.
      };
    }