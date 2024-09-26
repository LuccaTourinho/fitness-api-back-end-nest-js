import {Body, Controller, Get, Param, Post, Patch, Delete} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealRequest } from './dto/create-meal.request';
import { UpdateMealRequest } from './dto/update-meal.request';

@Controller('meals')
export class MealsController {
    constructor(private readonly mealsService: MealsService) {}

    @Get()
    getMeals() {
        return this.mealsService.getMeals();
    }

    @Get(':id')
    getMealsById(@Param('id') mealId: string) {
        return this.mealsService.getMealsById(parseInt(mealId));
    }

    @Patch(':id')
    updateMeal(
        @Param('id') mealId: string, 
        @Body() request: UpdateMealRequest
    ) {
        return this.mealsService.updateMeal(parseInt(mealId), request);
    }

    @Post()
    createMeal(@Body() request: CreateMealRequest) {
        return this.mealsService.createMeal(request);
    }

    @Delete(':id')
    deleteMeal(@Param('id') mealId: string) {
        return this.mealsService.deleteMeal(parseInt(mealId));
    }
}
