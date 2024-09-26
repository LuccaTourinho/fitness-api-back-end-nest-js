import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class BodyService {
    constructor(
        @Inject(DATABASE_CONNECTION) 
        private readonly database: NodePgDatabase<typeof schema>,
    ){}

    async getBody() {
        try{
            const bodies = await this.database.query.body.findMany();

            return bodies.map((body) => ({
                id: body.id,
                dt_measure: body.dt_measure,
                height: body.height,
                weight: body.weight
            }));
        }catch(error){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching bodies',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getBodyById(bodyId: number) {
        try{
            const body = await this.database.query.body.findFirst({
                where: eq(schema.body.id, bodyId),
            });

            if (!body) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Body not found',
                }, HttpStatus.NOT_FOUND);
            }

            return {
                id: body.id,
                dt_measure: body.dt_measure,
                height: body.height,
                weight: body.weight
            };
        }catch(error){
            if (error instanceof HttpException) {
                throw error; 
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching body',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createBody(body: typeof schema.body.$inferInsert) {
        try{
            return await this.database.transaction(async (tx) => {
                const newBody = await tx.insert(schema.body)
                                            .values(body)
                                            .returning({
                                                id: schema.body.id,
                                                dt_measure: schema.body.dt_measure,
                                                height: schema.body.height,
                                                weight: schema.body.weight
                                            });
                if (!newBody) {
                    throw new HttpException({
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Failed to create body',
                    }, HttpStatus.BAD_REQUEST);
                }

                return newBody;
            })
        }catch(error){
            if (error instanceof HttpException) {
                throw error; 
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while creating body',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateBody(bodyId: number, body: Partial<typeof schema.body.$inferInsert>) {
        try{
            await this.database.transaction(async (tx) => {
                const bodyData: Partial<typeof schema.body.$inferInsert> = {};

                if (body.dt_measure) bodyData.dt_measure = body.dt_measure;
                if (body.height) bodyData.height = body.height;
                if (body.weight) bodyData.weight = body.weight;

                const updatedBody = await tx.update(schema.body)
                                            .set(bodyData)
                                            .where(eq(schema.body.id, bodyId))
                                            .returning({
                                                id: schema.body.id,
                                                dt_measure: schema.body.dt_measure,
                                                height: schema.body.height,
                                                weight: schema.body.weight
                                            });
                if (updatedBody.length === 0) {
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'Body not found',
                    }, HttpStatus.NOT_FOUND);
                }
                return updatedBody[0];
            });
        }catch(error){
            if (error instanceof HttpException) {
                throw error; 
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while updating body',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteBody(bodyId: number) {
        try{
            await this.database.transaction(async (tx) => {
                const result = await tx.delete(schema.body).where(eq(schema.body.id, bodyId)).returning();
                if (result.length === 0) {
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'Body not found',
                    }, HttpStatus.NOT_FOUND);
                }

                return { message: 'Body deleted successfully' };
            });
        }catch(error){
            if (error instanceof HttpException) {
                throw error; 
            }
            
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while deleting body',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
