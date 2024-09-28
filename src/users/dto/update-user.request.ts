import { IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserRequest {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsNotEmpty({ message: 'Password should not be empty.' })
    @IsOptional()
    password?: string;

    constructor(email?: string, password?: string) {
        this.email = email;
        this.password = password;
    }
}
