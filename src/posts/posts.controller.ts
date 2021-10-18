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
  //UseInterceptors,
} from '@nestjs/common';
//import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateAndModifyPostDto, PostsResponseDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

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
  //Create one post
  @Post()
  //@UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Request() req,
    @Body() body: CreateAndModifyPostDto,
  ): Promise<PostsResponseDto> {
    const newPost = await this.postsService.createPost({
      userId: req.user.id,
      content: body.content,
    });
    return newPost;
  }
  //Modify on post
  @Patch('/:postId')
  async modifyPost(
    @Param('postId') postId: number,
    @Body() body: CreateAndModifyPostDto,
  ): Promise<PostsResponseDto> {
    const modifiedPost = await this.postsService.updatePost(postId, body);
    return modifiedPost;
  }
  //To delete one post
  @Delete('/:postId')
  async deletePost(@Param('postId') postId: number): Promise<PostsResponseDto> {
    const deletedPost = await this.postsService.deletePost(postId);
    return deletedPost;
  }
}
