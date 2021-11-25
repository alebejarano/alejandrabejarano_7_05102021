//DTO (Data Transfer Object) schema.
//An object that defines how the data will be sent over the network.
//The data for the request and response.
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

  @IsEmail({}, { message: 'Invalid email adress' })
  email: string;

  //profile pic
  profilePic?: any = '';
}
//to upload a profile pic if wanted
export class UserProfilePicDto {
  profilePic?: any = '';
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
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  access_token: string;
}
//Update the user info
export class UpdatedUserDto extends PartialType(CreateUserDto) {}
