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
  // declare and initialize the Service
  constructor(private postsService: PostsService) {}
  //Get all posts, we pass it to the service to find the posts
  @Get()
  async getAllPosts(): Promise<PostsResponseDto[]> {
    return this.postsService.findAll();
  }
  //Find the posts by user
  @Get('/user')
  async getPostByUser(@Request() req): Promise<any> {
    return this.postsService.findPostsByUser(req.user.id);
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
  async createPost(
    @Request() req,
    @Body()
    body: CreateAndModifyPostDto,
  ): Promise<PostsResponseDto> {
    const data = {
      //here i take the id of the user that is logedin
      userId: req.user.id,
      content: body.content,
    };
    const newPost = await this.postsService.createPost(data);

    return newPost;
  }

  //Post just to handle photos send during create post
  @Post('/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return {
      url: `http://localhost:3000/file/${file.filename}`,
    };
  }

  /*Get route which will take the imagepath as an argument 
  and return the image using the sendFile method.*/
  @Get('/:imgpath')
  seeUploadedFile(@Param('imgpath') file, @Res() res) {
    return res.sendFile(file, { root: './files' });
  }

  //Modify one post and or the file
  @Patch('/:postId')
  async modifyPost(
    @Request() req,
    @Param('postId') postId,
    @Body()
    body: CreateAndModifyPostDto,
  ): Promise<any> {
    const post = await this.postsService.findById(postId);
    //check if the user who wans to modify the post is the one who created it
    if (req.user.id === post.userId) {
      const modifiedPost = await this.postsService.updatePost(post, body);
      return modifiedPost;
    } else {
      //if it is not the owner of the post
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
  @Post('/:postId/like')
  async likePost(@Request() req, @Param('postId') postId): Promise<any> {
    const post = await this.postsService.findById(postId);
    return await this.postsService.likePost(post, req.user.id);
  }
  //To delete one post
  @Delete('/:postId')
  async deletePost(@Param('postId') postId: number): Promise<PostsResponseDto> {
    const deletedPost = await this.postsService.deletePost(postId);
    return deletedPost;
  }

  //For the comments
  @Post('/:postId/comment')
  async createComment(@Request() req, @Param('postId') postId): Promise<any> {
    const post = await this.postsService.findById(postId);
    return await this.postsService.createComment(post, req.user.id, req.body);
  }
  @Delete('/comments/:commentId')
  async deleteComment(
    @Request() req,
    @Param('commentId') commentId,
  ): Promise<any> {
    const deletedComment = this.postsService.deleteComment(
      req.user.id,
      commentId,
    );
    return deletedComment;
  }
}
