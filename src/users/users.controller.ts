import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreatedUserResponseDto, CreateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

//Controllers are responsible for handling incoming requests and returning responses to the client.
//A controller's purpose is to receive specific requests for the application.
@Controller('users')
//here is the route that does not need to be auth
//for Creating a new user, in the signup page
export class UsersController {
  constructor(
    //Service available through Dependency Injection
    private usersService: UsersService,
    //we pass our authorization logic, validating users password
    //and for login returning the token
    private authService: AuthService,
  ) {}
  @Post()
  //for the signup
  async createUser(
    @Body() body: CreateUserDto,
  ): Promise<CreatedUserResponseDto> {
    const password = body.password;
    body.password = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.createUser(body);
    if (newUser) {
      //to auth the new created user to enter the homepage
      const login = await this.authService.login(newUser);
      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        access_token: login.access_token,
      };
    }
    throw new BadRequestException();
  }
}
