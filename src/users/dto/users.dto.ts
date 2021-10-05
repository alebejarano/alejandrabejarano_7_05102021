//DTO (Data Transfer Object) schema. An object that defines how the data will be sent over the network. The data for the request and response.
//Get all users and get user by id
export class UsersResponseDto {
  id: string;
  name: string;
}
//create user. When signing up
export class CreateUserDto {
  name: string;
  mail: string;
  password: string;
}
//Response Dto when user has been created
export class CreatedUserResponseDto {
  id: string;
  name: string;
  mail: string;
  token: string;
}
//Modify the user info
export class ModifiedUserDto {
  name: string;
  password: string;
}
