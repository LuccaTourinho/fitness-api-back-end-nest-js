import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class ExercisesService {
    constructor(
        @Inject(DATABASE_CONNECTION) 
        private readonly database: NodePgDatabase<typeof schema>,
    ){}

    async getExercises() {
        try{
            const exercises = await this.database.query.exercises.findMany();

            return exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
            }));
        }catch(error){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching exercises',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getExerciseById(exerciseId: number) {
        try{
            const exercise = await this.database.query.exercises.findFirst({
                where: eq(schema.exercises.id, exerciseId),
            });

            if (!exercise) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Exercise not found',
                }, HttpStatus.NOT_FOUND);
            }

            return {
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
            };
        }catch(error){
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching exercise',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createExercise(exercise: typeof schema.exercises.$inferInsert) {
        try{
            return await this.database.transaction(async (tx) => {
                const newExercise = await tx.insert(schema.exercises)
                                            .values(exercise)
                                            .returning({
                                                id: schema.exercises.id,
                                                name: schema.exercises.name,
                                                description: schema.exercises.description
                                            }); 
                if(!newExercise) {
                    throw new HttpException({
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Failed to create exercise',
                    }, HttpStatus.BAD_REQUEST);
                }

                return newExercise;
            });
        }catch(error){
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while creating exercise',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateExercise(exerciseId: number, exercise:Partial<typeof schema.exercises.$inferInsert>){
        try{
            await this.database.transaction(async (tx) => {
                const exerciseData: Partial<typeof schema.exercises.$inferInsert> = {};

                if (exercise.name) exerciseData.name = exercise.name;
                if (exercise.description) exerciseData.description = exercise.description;

                const updatedExercise = await tx.update(schema.exercises)
                                                .set(exerciseData)
                                                .where(eq(schema.exercises.id, exerciseId))
                                                .returning({
                                                    id: schema.exercises.id,
                                                    name: schema.exercises.name,
                                                    description: schema.exercises.description
                                                });
                if(updatedExercise.length === 0) {
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'Exercise not found',
                    }, HttpStatus.NOT_FOUND);
                }

                return updatedExercise[0];
            })
        }catch(error){
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while updating exercise',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteExercise(exerciseId: number) {
        try{
            await this.database.transaction(async (tx) => {
                const result = await tx.delete(schema.exercises).where(eq(schema.exercises.id, exerciseId)).returning();
                if(result.length === 0) {
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'Exercise not found',
                    }, HttpStatus.NOT_FOUND);
                }

                return { message: 'Exercise deleted successfully' };
            });
        }catch(error){
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while deleting exercise',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
