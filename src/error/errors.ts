import { HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';

export class Errors {
    static handleNotFoundError(message: string) {
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: message,
        }, HttpStatus.NOT_FOUND);
    }

    static handleServerError(message: string, error: any) {
        throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: message,
            details: error.message, // Inclui detalhes técnicos do erro
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    static handleBadRequest(message: string, details: string[] = []) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: message,
            details: details,
        }, HttpStatus.BAD_REQUEST);
    }

    static async validateAndThrow<T extends object>(request: T) {
        const errors = await validate(request);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => {
                return Object.values(err.constraints).join(', '); 
            });
            this.handleBadRequest('Validation failed!', errorMessages);
        }
    }
}
