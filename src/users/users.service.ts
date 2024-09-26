import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
    constructor(
        @Inject(DATABASE_CONNECTION) 
        private readonly database: NodePgDatabase<typeof schema>
    ) {}

    async getUsers() {
        try{
            const users = await this.database.query.users.findMany();

            return users.map((user) => ({
                id: user.id,
                email: user.email,
                password: user.password,
            }));
        }catch(error){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching users',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserById(userId: number) {
        try{
            const user = await this.database.query.users.findFirst({
                where: eq(schema.users.id, userId),
                with: {profile: true},
            });

            if(!user){
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'User not found',
                }, HttpStatus.NOT_FOUND);
            }

            return {
                id: user.id,
                email: user.email,
                profile: {
                    id: user.profile.id,
                    name: user.profile.name,
                    gender: user.profile.gender,
                    birthdate: user.profile.birthdate,
                },
            };
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching user',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUser(userId: number, user: Partial<typeof schema.users.$inferInsert>) {
        try{
            await this.database.transaction(async (tx) => {
                const userData: Partial<typeof schema.users.$inferInsert> = {};

                if(user.email) userData.email = user.email;
                if(user.password) userData.password = user.password;

                const updatedUser = await tx.update(schema.users)
                                            .set(userData)
                                            .where(eq(schema.users.id, userId))
                                            .returning({
                                                id: schema.users.id,
                                                email: schema.users.email,
                                                password: schema.users.password,
                                            });

                if(updatedUser.length === 0){
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'User not found',
                    }, HttpStatus.NOT_FOUND);
                }

                return updatedUser[0];
            });
        } catch(error) {
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while updating user',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProfile(profileId: number, profile: Partial<typeof schema.profiles.$inferInsert>) {
        try{
            await this.database.transaction(async (tx) => {
                const profileData: Partial<typeof schema.profiles.$inferInsert> = {};

                if(profile.name) profileData.name = profile.name;
                if(profile.gender) profileData.gender = profile.gender;
                if(profile.birthdate) profileData.birthdate = profile.birthdate;

                const updatedProfile = await tx.update(schema.profiles)
                                                .set(profileData)
                                                .where(eq(schema.profiles.id, profileId))
                                                .returning({
                                                    id: schema.profiles.id,
                                                    name: schema.profiles.name,
                                                    gender: schema.profiles.gender,
                                                    birthdate: schema.profiles.birthdate,
                                                });

                if(updatedProfile.length === 0){
                    throw new HttpException({
                        status: HttpStatus.NOT_FOUND,
                        error: 'Profile not found',
                    }, HttpStatus.NOT_FOUND);
                }

                return updatedProfile[0];
            });
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while updating profile',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createUser(user: typeof schema.users.$inferInsert) {
        try{
            return await this.database.transaction(async (tx) => {
                const createdUser = await tx.insert(schema.users).values(user).returning({
                    id: schema.users.id,
                    email: schema.users.email,
                    password: schema.users.password,
                });

                if(!createdUser){
                    throw new HttpException({
                        status: HttpStatus.BAD_REQUEST,
                        error: 'An error occurred while creating user',
                    }, HttpStatus.BAD_REQUEST);
                }

                return createdUser;
            })
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while creating user',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createProfile(profile: typeof schema.profiles.$inferInsert) {
        try{
            return await this.database.transaction(async (tx) => {
               const createdProfile = await tx.insert(schema.profiles).values(profile).returning({
                   id: schema.profiles.id,
                   name: schema.profiles.name,
                   gender: schema.profiles.gender,
                   birthdate: schema.profiles.birthdate,
               }); 

               if(!createdProfile){
                   throw new HttpException({
                       status: HttpStatus.BAD_REQUEST,
                       error: 'An error occurred while creating profile',
                   }, HttpStatus.BAD_REQUEST);
               }

               return createdProfile;
            });
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while creating profile',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProfileById(profileId: number) {
        try{
            const profile = await this.database.query.profiles.findFirst({
                where: eq(schema.profiles.id, profileId),
                with: {liquids: true, exercises: true, body: true, meals: true},
            });

            if(!profile){
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Profile not found',
                }, HttpStatus.NOT_FOUND);
            }

            return {
                id: profile.id,
                name: profile.name,
                gender: profile.gender,
                birthdate: profile.birthdate,
                body: profile.body,
                liquids: profile.liquids,
                exercises: profile.exercises,
                meals: profile.meals,
            }
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while fetching profile',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
