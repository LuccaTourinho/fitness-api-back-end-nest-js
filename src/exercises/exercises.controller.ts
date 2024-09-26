import {Body, Controller, Get, Post, Patch, Param, Delete} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseRequest } from './dto/create-exercise.request';
import { UpdateExerciseRequest } from './dto/update-exercise.request';

@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) {}

    @Get()
    getExercises() {
        return this.exercisesService.getExercises();
    }

    @Get(':id')
    getExercisesById(@Param('id') exerciseId: string) {
        return this.exercisesService.getExerciseById(parseInt(exerciseId));
    }

    @Patch(':id')
    updateExercise(
        @Param('id') exerciseId: string, 
        @Body() request: UpdateExerciseRequest
    ) {
        return this.exercisesService.updateExercise(parseInt(exerciseId), request);
    }

    @Post()
    createExercise(@Body() request: CreateExerciseRequest) {
        return this.exercisesService.createExercise(request);
    }

    @Delete(':id')
    deleteExercise(@Param('id') exerciseId: string) {
        return this.exercisesService.deleteExercise(parseInt(exerciseId));
    }
}
