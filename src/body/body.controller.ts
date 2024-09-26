import {Body, Controller, Get, Post, Patch, Param, Delete} from '@nestjs/common';
import { BodyService } from './body.service';
import { CreateBodyRequest } from './dto/create-body.request';
import { UpdateBodyRequest } from './dto/update-body.request';

@Controller('body')
export class BodyController {
    constructor(private readonly bodyService: BodyService) {}

    @Get()
    getBody() {
        return this.bodyService.getBody();
    }

    @Get(':id')
    getBodyById(@Param('id') bodyId: string) {
        return this.bodyService.getBodyById(parseInt(bodyId));
    }

    @Post()
    createBody(@Body() request: CreateBodyRequest) {
        return this.bodyService.createBody(request);
    }

    @Patch(':id')
    updateBody(
        @Param('id') bodyId: string, 
        @Body() request: UpdateBodyRequest
    ) {
        return this.bodyService.updateBody(parseInt(bodyId), request);
    }

    @Delete(':id')
    deleteBody(@Param('id') bodyId: string) {
        return this.bodyService.deleteBody(parseInt(bodyId));
    }
}
