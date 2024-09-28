import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateProfileRequest {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'Gender is required' })
    @IsString({ message: 'Gender must be a string' })
    gender: string;

    @IsNotEmpty({ message: 'Birthdate is required' })
    birthdate: string;

    @IsNotEmpty({ message: 'User ID is required' })
    @IsInt({ message: 'User ID must be an integer' })
    userId: number;

    constructor(name: string, gender: string, birthdate: string, userId: number) {
        this.name = name;
        this.gender = gender;
        this.birthdate = birthdate;
        this.userId = userId;
    }
}
