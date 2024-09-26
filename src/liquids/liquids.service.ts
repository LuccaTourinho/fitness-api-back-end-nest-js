import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class LiquidsService {
    constructor(
        @Inject(DATABASE_CONNECTION) 
        private readonly database: NodePgDatabase<typeof schema>,
    ){}

    async getLiquids() {
        try{
            const liquids = await this.database.query.liquids.findMany();

            return liquids.map((liquid) => ({
                id: liquid.id,
                dt_drinked: liquid.dt_drinked,
                name: liquid.name,
                volume: liquid.volume
            }));
        }catch(error){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching liquids',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getLiquidById(liquidId: number) {
        try{
            const liquid = await this.database.query.liquids.findFirst({
                where: eq(schema.liquids.id, liquidId),
            });

            if(!liquid){
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Liquid not found',
                }, HttpStatus.NOT_FOUND);
            }

            return {
                id: liquid.id,
                dt_drinked: liquid.dt_drinked,
                name: liquid.name,
                volume: liquid.volume
            };
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching liquid',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createLiquid(liquid: typeof schema.liquids.$inferInsert) {
        try{
            return await this.database.transaction(async (tx) => {
                const newLiquid = await tx.insert(schema.liquids)
                                          .values(liquid)
                                          .returning({
                                              id: schema.liquids.id,
                                              dt_drinked: schema.liquids.dt_drinked,
                                              name: schema.liquids.name,
                                              volume: schema.liquids.volume
                                          });
                if(!newLiquid){
                    throw new HttpException({
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Failed to create liquid',
                    }, HttpStatus.BAD_REQUEST);
                }

                return newLiquid;
            });
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while creating liquid',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateLiquid(liquidId: number, liquid: Partial<typeof schema.liquids.$inferInsert>) {
        try{
            await this.database.transaction(async (tx) => {
                const liquidData: Partial<typeof schema.liquids.$inferInsert> = {}

                if(liquid.name) liquidData.name = liquid.name;
                if(liquid.volume) liquidData.volume = liquid.volume;
                if(liquid.dt_drinked) liquidData.dt_drinked = liquid.dt_drinked;

                const updatedLiquid = await tx.update(schema.liquids)
                                                .set(liquidData)
                                                .where(eq(schema.liquids.id, liquidId))
                                                .returning({
                                                    id: schema.liquids.id,
                                                    dt_drinked: schema.liquids.dt_drinked,
                                                    name: schema.liquids.name,
                                                    volume: schema.liquids.volume
                                                });
                if(updatedLiquid.length === 0){
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'Liquid not found',
                    }, HttpStatus.NOT_FOUND);
                }

                return updatedLiquid[0];
            });
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while updating liquid',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteLiquid(liquidId: number) {
        try{
            await this.database.transaction(async (tx) => {
                const result = await tx.delete(schema.liquids).where(eq(schema.liquids.id, liquidId)).returning();
                if(result.length === 0){
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'Liquid not found',
                    }, HttpStatus.NOT_FOUND);
                }

                return { message: 'Liquid deleted successfully' };
            });
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while deleting liquid',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
