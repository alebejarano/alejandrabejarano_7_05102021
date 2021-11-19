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
import { UpdatedUserDto, UsersResponseDto } from './dto/users.dto';
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
//pass our JWT strategy for validating and extracting the token
@UseGuards(JwtAuthGuard)
export class UsersControllerAuth {
  constructor(
    private usersService: UsersService,
    //we pass our authorization logic, validating users password
    //and for login returning the token
    private authService: AuthService,
  ) {}
  //find all users in our database
  @Get()
  async getAllUsers(): Promise<UsersResponseDto[]> {
    return this.usersService.findAll();
  }
  //find the user
  @Get('/:userId')
  async getUserById(
    //Pipe to make sure and validate that the id
    //we'll be reciving is a number
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UsersResponseDto> {
    return this.usersService.findById(userId);
  }
  //to modify the users info
  @Patch('/:userId')
  async modifyUser(
    @Param('userId') userId: number,
    @Body() data: UpdatedUserDto,
  ): Promise<UsersResponseDto> {
    const password = data.password;
    data.password = await bcrypt.hash(password, 10);
    const updatedUser = await this.usersService.updateUser(userId, data);
    //we only return the id and the name
    return { id: updatedUser.id, name: updatedUser.name };
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
      //we pass only the filename
      file.filename,
    );
    return newPic;
  }
  //to delete the profile pic
  @Delete('/pic')
  async deletePic(@Request() req): Promise<any> {
    const deletedPic = await this.usersService.deleteProfilePic(req.user.id);
    return deletedPic;
  }
  //Delete user from database
  @Delete('/:userId')
  async deleteUser(@Param('userId') userId): Promise<UsersResponseDto> {
    const deletedUser = await this.usersService.deleteUser(userId);
    return { id: deletedUser.id, name: deletedUser.name };
  }
}
