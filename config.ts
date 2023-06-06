import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = parseInt(process.env.PORT ?? '3000', 10);

export const DB_HOST: string | undefined = process.env.DB_HOST;
export const DB_USER: string | undefined = process.env.DB_USER;
export const DB_PASSWORD: string | undefined = process.env.DB_PASSWORD;
export const DB_DATABASE: string | undefined = process.env.DB_DATABASE;

export const URL_WHITELIST: string[] | undefined = process.env.URL_WHITELIST?.split(',');

export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY ?? 'tokentest';
export const JWT_EXPIRATION_TIME: number = parseInt(process.env.JWT_EXPIRATION_TIME ?? '3600', 10);