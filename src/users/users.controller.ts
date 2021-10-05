import { Controller, Get } from '@nestjs/common';

//Controllers are responsible for handling incoming requests and returning responses to the client.
//A controller's purpose is to receive specific requests for the application.
@Controller('users')
export class UsersController {
  @Get()
  getUsers(): string {
    return 'All the users';
  }
}
