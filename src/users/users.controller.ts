import { Body, Controller, Get, Post, Patch, Param} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/create-user.request';
import { CreateProfileRequest } from './dto/create-profile.request';
import { UpdateUserRequest } from './dto/update-user.request';
import { UpdateProfileRequest } from './dto/update-profile.request';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get()
    async getUsers() {
        return this.usersService.getUsers();
    }

    @Get(':id')
    async getUser(@Param('id') userId: string) {
        return this.usersService.getUserById(parseInt(userId));
    }

    @Patch(':id')
    async updateUser(
        @Param('id') userId: string, 
        @Body() request: UpdateUserRequest
    ) {
        return this.usersService.updateUser(parseInt(userId), request);
    }

    @Patch('profiles/:id')
    async updateProfile(
        @Param('id') profileId: string, 
        @Body() request: UpdateProfileRequest
    ) {
        return this.usersService.updateProfile(parseInt(profileId), request);
    }

    @Post()
    async createUser(@Body() request: CreateUserRequest) {
        return this.usersService.createUser(request);
    }

    @Post('profiles')
    async createProfile(@Body() request: CreateProfileRequest) {
        return this.usersService.createProfile(request);
    }

    @Get('profiles/:id')
    async getProfile(@Param('id') profileId: string) {
        return this.usersService.getProfileById(parseInt(profileId));
    }
}
