import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { BodyModule } from './body/body.module';
import { LiquidsModule } from './liquids/liquids.module';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UsersModule, MealsModule, BodyModule, LiquidsModule, ExercisesModule],
  controllers: [],
})
export class AppModule {}
