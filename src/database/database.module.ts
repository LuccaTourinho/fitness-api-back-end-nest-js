import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database-connection';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as userSchema from '../users/schema';
import * as mealSchema from '../meals/schema';
import * as bodySchema from '../body/schema';
import * as liquidSchema from '../liquids/schema';
import * as exerciseSchema from '../exercises/schema';

@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useFactory: (configService: ConfigService) => {
                const pool = new Pool({
                    connectionString: configService.getOrThrow('DATABASE_URL'),
                });
                return drizzle(pool, {
                    schema: {
                        ...userSchema,
                        ...mealSchema,
                        ...bodySchema,
                        ...liquidSchema,
                        ...exerciseSchema
                    }
                });
            },
            inject: [ConfigService],
        }
    ],
    exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
