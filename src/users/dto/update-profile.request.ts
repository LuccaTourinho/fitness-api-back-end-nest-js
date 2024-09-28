import { IsNotEmpty, IsString, IsInt,  IsOptional } from 'class-validator';

export class UpdateProfileRequest {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @IsOptional()
    name?: string;

    @IsNotEmpty({ message: 'Gender is required' })
    @IsString({ message: 'Gender must be a string' })
    @IsOptional()
    gender?: string;

    @IsNotEmpty({ message: 'Birthdate is required' })
    @IsOptional()
    birthdate?: string;

    @IsNotEmpty({ message: 'User ID is required' })
    @IsInt({ message: 'User ID must be an integer' })
    @IsOptional()
    userId?: number;

    constructor(name?: string, gender?: string, birthdate?: string, userId?: number) {
        this.name = name;
        this.gender = gender;
        this.birthdate = birthdate;
        this.userId = userId;
    }
}