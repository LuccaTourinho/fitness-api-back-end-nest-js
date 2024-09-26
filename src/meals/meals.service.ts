import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class MealsService {
    constructor(
        @Inject(DATABASE_CONNECTION) 
        private readonly database: NodePgDatabase<typeof schema>,
    ){}

    async getMeals() {
        try{
            const meals = await this.database.query.meals.findMany();

            return meals.map((meal) => ({
                id: meal.id,
                dt_meal: meal.dt_meal,
                tot_carb_kcal: meal.tot_carb_kcal,
                tot_protein_kcal: meal.tot_protein_kcal,
                tot_fat_kcal: meal.tot_fat_kcal,
                description: meal.description
            }));
        }catch(error){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching meals',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMealsById(mealId: number) {
        try{
            const meal = await this.database.query.meals.findFirst({
                where: eq(schema.meals.id, mealId),
            });

            if (!meal) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Meals not found',
                }, HttpStatus.NOT_FOUND);
            }

            return {
                id: meal.id,
                dt_meal: meal.dt_meal,
                tot_carb_kcal: meal.tot_carb_kcal,
                tot_protein_kcal: meal.tot_protein_kcal,
                tot_fat_kcal: meal.tot_fat_kcal,
                description: meal.description,
            };
        }catch(error){
            if (error instanceof HttpException) {
                throw error; 
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to retrieve meal',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createMeal(meal: typeof schema.meals.$inferInsert) {
        try {
            return await this.database.transaction(async (tx) => {
                const newMeal = await tx.insert(schema.meals)
                                        .values(meal)
                                        .returning({
                                            id: schema.meals.id,
                                            dt_meal: schema.meals.dt_meal,
                                            tot_carb_kcal: schema.meals.tot_carb_kcal,
                                            tot_protein_kcal: schema.meals.tot_protein_kcal,
                                            tot_fat_kcal: schema.meals.tot_fat_kcal,
                                            description: schema.meals.description
                                        });
    
                if (!newMeal) {
                    throw new HttpException({
                        status: HttpStatus.BAD_REQUEST,
                        error: 'Failed to create meal',
                    }, HttpStatus.BAD_REQUEST);
                }
    
                return newMeal;
            });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; 
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to create meal',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateMeal(mealId: number, meal: Partial<typeof schema.meals.$inferInsert>) {
        try{
            await this.database.transaction(async (tx) => {
                const mealData: Partial<typeof schema.meals.$inferInsert> = {};

                if (meal.dt_meal) mealData.dt_meal = meal.dt_meal;
                if (meal.tot_carb_kcal) mealData.tot_carb_kcal = meal.tot_carb_kcal;
                if (meal.tot_protein_kcal) mealData.tot_protein_kcal = meal.tot_protein_kcal;
                if (meal.tot_fat_kcal) mealData.tot_fat_kcal = meal.tot_fat_kcal;
                if (meal.description) mealData.description = meal.description;

                const updatedMeal = await tx.update(schema.meals)
                                            .set({...mealData, updatedAt: new Date()}as typeof schema.meals.$inferInsert)
                                            .where(eq(schema.meals.id, mealId))
                                            .returning({
                                                id: schema.meals.id,
                                                dt_meal: schema.meals.dt_meal,
                                                tot_carb_kcal: schema.meals.tot_carb_kcal,
                                                tot_protein_kcal: schema.meals.tot_protein_kcal,
                                                tot_fat_kcal: schema.meals.tot_fat_kcal,
                                                description: schema.meals.description
                                            });
                
                if (updatedMeal.length === 0) {
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'Meals not found',
                    }, HttpStatus.NOT_FOUND);
                }

                return updatedMeal[0];
            });
        }catch(error){
            if (error instanceof HttpException) {
                throw error; 
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to update meal',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteMeal(mealId: number) {
        try {
            await this.database.transaction(async (tx) => {
                const result = await tx.delete(schema.meals).where(eq(schema.meals.id, mealId)).returning();
    
                if (result.length === 0) {
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'Meals not found',
                    }, HttpStatus.NOT_FOUND);
                }
    
                return { message: 'Meal deleted successfully' };
            });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; 
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to delete meal',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }    
}
