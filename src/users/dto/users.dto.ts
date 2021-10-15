//DTO (Data Transfer Object) schema. An object that defines how the data will be sent over the network. The data for the request and response.
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

//Get all users and get user by id
export class UsersResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
//create user. When signing up
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Invalid email adress' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @Length(8)
  password: string;
}
//Response Dto when user has been created
export class CreatedUserResponseDto {
  id: number;
  name: string;
  email: string;
  token: string;
}
//Update the user info
export class UpdatedUserDto extends PartialType(CreateUserDto) {}
