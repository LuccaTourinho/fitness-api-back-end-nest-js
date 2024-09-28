import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserRequest {
    @IsEmail() 
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' }) 
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}