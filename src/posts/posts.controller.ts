import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAndModifyPostDto, PostsResponseDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
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
    @Param('postId') postId: string,
  ): Promise<PostsResponseDto> {
    return this.postsService.findById(postId);
  }
  //Create one post
  @Post()
  async createPost(
    @Body() body: CreateAndModifyPostDto,
  ): Promise<PostsResponseDto> {
    const newPost = await this.postsService.createPost(body);
    return newPost;
  }
  @Patch('/:postId')
  async modifyPost(
    @Param('postId') postId: string,
    @Body() body: CreateAndModifyPostDto,
  ): Promise<PostsResponseDto> {
    const modifiedPost = await this.postsService.updatePost(postId, body);
    return modifiedPost;
  }
  @Delete('/:postId')
  async deletePost(@Param('postId') postId: string): Promise<PostsResponseDto> {
    const deletedPost = await this.postsService.deletePost(postId);
    return deletedPost;
  }
}
