import { Module } from '@nestjs/common';
import { BodyController } from './body.controller';
import { BodyService } from './body.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BodyController],
  providers: [BodyService]
})
export class BodyModule {}
