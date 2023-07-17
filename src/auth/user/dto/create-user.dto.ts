import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsPositive, ValidateIf } from "class-validator"
import { IsNull } from "typeorm"
export class createUserDto {
    @IsEmail()
    email: string
    @IsNotEmpty()
    password: string
    name: string
    first_name?: string
    last_name?: string
    middle_name?: string
    name_ext?: string
    @IsPhoneNumber()
    contact: string
    position: string
    role_id?: number | null
    default?: boolean = false
}

