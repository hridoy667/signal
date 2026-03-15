/* eslint-disable prettier/prettier */
import { IsNotEmpty,IsOptional,IsString } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    first_name:string;

    @IsOptional()
    @IsString()
    last_name:string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    district: string;
    
    @IsString()
    gender:string;
}
