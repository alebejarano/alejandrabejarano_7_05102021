import {
  Body,
  Controller,
  Delete,
  //forwardRef,
  Get,
  //Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreatedUserResponseDto,
  CreateUserDto,
  UpdatedUserDto,
  UsersResponseDto,
} from './dto/users.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

//Controllers are responsible for handling incoming requests and returning responses to the client.
//A controller's purpose is to receive specific requests for the application.
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Get()
  async getAllUsers(): Promise<UsersResponseDto[]> {
    return this.usersService.findAll();
  }
  @Get('/:userId')
  async getUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UsersResponseDto> {
    return this.usersService.findById(userId);
  }
  @Post()
  async createUser(
    @Body() body: CreateUserDto,
  ): Promise<CreatedUserResponseDto> {
    const password = body.password;
    body.password = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.createUser(body);
    const login = await this.authService.login(newUser);
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: login.access_token,
    };
  }
  @Patch('/userId')
  async modifyUser(
    @Param('userId') userId,
    @Body() data: UpdatedUserDto,
  ): Promise<UsersResponseDto> {
    const updatedUser = await this.usersService.updateUser(userId, data);
    return { id: updatedUser.id, name: updatedUser.name };
  }
  @Delete('/:userId')
  async deleteUser(@Param('userId') userId): Promise<UsersResponseDto> {
    const deletedUser = await this.usersService.deleteUser(userId);
    return { id: deletedUser.id, name: deletedUser.name };
  }
}
