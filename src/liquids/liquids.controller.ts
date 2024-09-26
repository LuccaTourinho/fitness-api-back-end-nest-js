import {Body, Controller, Get, Post, Patch, Param, Delete} from '@nestjs/common';
import { LiquidsService } from './liquids.service';
import { CreateLiquidRequest } from './dto/create-liquid.request';
import { UpdateLiquidRequest } from './dto/update-liquid.request';

@Controller('liquids')
export class LiquidsController {
    constructor(private readonly liquidsService: LiquidsService) {}

    @Get()
    getLiquids() {
        return this.liquidsService.getLiquids();
    }

    @Get(':id')
    getLiquidById(@Param('id') liquidId: string) {
        return this.liquidsService.getLiquidById(parseInt(liquidId));
    }

    @Patch(':id')
    updateLiquid(
        @Param('id') liquidId: string, 
        @Body() request: UpdateLiquidRequest
    ) {
        return this.liquidsService.updateLiquid(parseInt(liquidId), request);
    }

    @Post()
    createLiquid(@Body() request: CreateLiquidRequest) {
        return this.liquidsService.createLiquid(request);
    }

    @Delete(':id')
    deleteLiquid(@Param('id') liquidId: string) {
        return this.liquidsService.deleteLiquid(parseInt(liquidId));
    }
}
