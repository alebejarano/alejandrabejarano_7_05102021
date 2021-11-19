import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  Request,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  CreatedUserResponseDto,
  CreateUserDto,
  UpdatedUserDto,
  UsersResponseDto,
} from './dto/users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { editFilename, imageFileFilter } from 'src/file-upload.utils';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

//Controllers are responsible for handling incoming requests and returning responses to the client.
//A controller's purpose is to receive specific requests for the application.
@Controller('users')
@UseGuards(JwtAuthGuard)
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
  //to upload a profile pic
  @Post('/pic')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadProfilePic(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    const newPic = await this.usersService.UpdateProfilePic(
      req.user.id,
      file.filename,
    );
    return newPic;
  }
  @Patch('/:userId')
  async modifyUser(
    @Param('userId') userId: number,
    @Body() data: UpdatedUserDto,
  ): Promise<UsersResponseDto> {
    const password = data.password;
    data.password = await bcrypt.hash(password, 10);
    const updatedUser = await this.usersService.updateUser(userId, data);
    return { id: updatedUser.id, name: updatedUser.name };
  }

  //to delete the profile pic
  @Delete('/pic')
  async deletePic(@Request() req): Promise<any> {
    const deletedPic = await this.usersService.deleteProfilePic(req.user.id);
    return deletedPic;
  }

  @Delete('/:userId')
  async deleteUser(@Param('userId') userId): Promise<UsersResponseDto> {
    const deletedUser = await this.usersService.deleteUser(userId);
    return { id: deletedUser.id, name: deletedUser.name };
  }
}
