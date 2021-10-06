import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import {
  //CreatedUserResponseDto,
  //CreateUserDto,
  ModifiedUserDto,
  UsersResponseDto,
} from './dto/users.dto';
import { UsersService } from './users.service';
//import { Users } from './interface/users.interface';

//Controllers are responsible for handling incoming requests and returning responses to the client.
//A controller's purpose is to receive specific requests for the application.
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async getAllUsers(): Promise<UsersResponseDto[]> {
    return this.usersService.findAll();
  }
  @Get('/:userId')
  async getUserById(
    @Param('userId') userId: string,
  ): Promise<UsersResponseDto> {
    return this.usersService.findById(userId);
  }
  /*@Post()
  createUser(@Body() body: Users): Users {
    return this.usersService.createUser(body);
  }*/
  @Patch('/userId')
  async modifyUser(
    @Param('userId') userId,
    @Body() data: ModifiedUserDto,
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
