import { Controller, Get, Param, Post, Put } from '@nestjs/common';

//Controllers are responsible for handling incoming requests and returning responses to the client.
//A controller's purpose is to receive specific requests for the application.
@Controller('users')
export class UsersController {
  @Get()
  getAllUsers(): string {
    return 'All the users';
  }
  @Get('/:userId')
  getUserById(@Param('userId') userId: string): string {
    return `The id of the user: ${userId}`;
  }
  @Post()
  createUser(): string {
    return 'The new user';
  }
  @Put('/userId')
  modifyUser(@Param('userId') userId: string): string {
    return `The modified user identified by id: ${userId}`;
  }
}
