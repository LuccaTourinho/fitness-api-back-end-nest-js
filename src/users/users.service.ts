import { Inject, Injectable, HttpException} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Errors } from '../error/errors';

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
            Errors.handleServerError('An error occurred while fetching users', error);
        }
    }

    async getUserById(userId: number) {
        try{
            const user = await this.database.query.users.findFirst({
                where: eq(schema.users.id, userId),
                with: {profile: true},
            });

            if(!user){
                Errors.handleNotFoundError('User not found');
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

            Errors.handleServerError('An error occurred while fetching user', error);
        }
    }

    async updateUser(userId: number, user: Partial<typeof schema.users.$inferInsert>) {
        try{
            await Errors.validateAndThrow(user);

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
                    Errors.handleNotFoundError('User not found');
                }

                return updatedUser[0];
            });
        } catch(error) {
            if(error instanceof HttpException){
                throw error;
            }

            Errors.handleServerError('An error occurred while updating user', error);
        }
    }

    async updateProfile(profileId: number, profile: Partial<typeof schema.profiles.$inferInsert>) {
        try{
            await Errors.validateAndThrow(profile);

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
                    Errors.handleNotFoundError('Profile not found');
                }

                return updatedProfile[0];
            });
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            Errors.handleServerError('An error occurred while updating profile', error);
        }
    }

    async createUser(user: typeof schema.users.$inferInsert) {
        try{
            await Errors.validateAndThrow(user);

            return await this.database.transaction(async (tx) => {
                const createdUser = await tx.insert(schema.users).values(user).returning({
                    id: schema.users.id,
                    email: schema.users.email,
                    password: schema.users.password,
                });

                if(!createdUser){
                    Errors.handleBadRequest('An error occurred while creating user');
                }

                return createdUser;
            })
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            Errors.handleServerError('An error occurred while creating user', error);
        }
    }

    async createProfile(profile: typeof schema.profiles.$inferInsert) {
        try{
            await Errors.validateAndThrow(profile);

            return await this.database.transaction(async (tx) => {
               const createdProfile = await tx.insert(schema.profiles).values(profile).returning({
                   id: schema.profiles.id,
                   name: schema.profiles.name,
                   gender: schema.profiles.gender,
                   birthdate: schema.profiles.birthdate,
               }); 

               if(!createdProfile){
                   Errors.handleBadRequest('An error occurred while creating profile');
               }

               return createdProfile;
            });
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }

            Errors.handleServerError('An error occurred while creating profile', error);
        }
    }

    async getProfileById(profileId: number) {
        try{
            const profile = await this.database.query.profiles.findFirst({
                where: eq(schema.profiles.id, profileId),
                with: {liquids: true, exercises: true, body: true, meals: true},
            });

            if(!profile){
                Errors.handleNotFoundError('Profile not found');
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

            Errors.handleServerError('An error occurred while fetching profile', error);
        }
    }
}
