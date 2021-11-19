import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateAndModifyPostDto, PostsResponseDto } from './dto/posts.dto';
import { PostsService } from './posts.service';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { editFilename, imageFileFilter } from 'src/file-upload.utils';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}
  //Get all posts, we pass it to the service to find the posts
  @Get()
  async getAllPosts(): Promise<PostsResponseDto[]> {
    return this.postsService.finAll();
  }
  //Fin a post by its Id, pass the logic to service via findById()
  @Get('/:postId')
  async getPostById(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostsResponseDto> {
    return this.postsService.findById(postId);
  }
  //Create one post and upload one file
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createPost(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: CreateAndModifyPostDto,
  ): Promise<PostsResponseDto> {
    const data = {
      //here i take the id of the user that is logedin
      userId: req.user.id,
      content: body.content,
    };
    if (file) {
      Object.assign(data, {
        file: file.filename,
      });
    }
    const newPost = await this.postsService.createPost(data);

    return newPost;
  }

  /*Get route which will take the imagepath as an argument 
  and return the image using the sendFile method.*/
  @Get('/:imgpath')
  seeUploadedFile(@Param('imgpath') file, @Res() res) {
    return res.sendFile(file, { root: './files' });
  }

  //Modify one post and or the file
  @Patch('/:postId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async modifyPost(
    @Request() req,
    @Param('postId') postId,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: CreateAndModifyPostDto,
  ): Promise<any> {
    const post = await this.postsService.findById(postId);
    //check if the user who wans to modify the post is the one who created it
    if (req.user.id === post.userId) {
      const modifiedPost = await this.postsService.updatePost(
        post,
        file.filename,
        body,
      );
      return modifiedPost;
    } else {
      //if it is not the owner of the post
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
  //To delete a file from post
  @Delete('/:postId/pic')
  async deletePostFile(@Param('postId') postId): Promise<any> {
    const deletedFile = await this.postsService.deleteFile(postId);
    return deletedFile;
  }
  //To delete one post
  @Delete('/:postId')
  async deletePost(@Param('postId') postId: number): Promise<PostsResponseDto> {
    const deletedPost = await this.postsService.deletePost(postId);
    return deletedPost;
  }
}
