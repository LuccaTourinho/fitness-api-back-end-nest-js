import { Module } from '@nestjs/common';
import { LiquidsController } from './liquids.controller';
import { LiquidsService } from './liquids.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LiquidsController],
  providers: [LiquidsService]
})
export class LiquidsModule {}
