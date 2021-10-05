import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get()
  getAllPosts(): string {
    return 'All the posts';
  }
  @Get('/:postId')
  getPostById(): string {
    return 'One post';
  }
  @Post()
  createPost(): string {
    return 'The post created';
  }
  @Put('/:postId')
  modifyPost(): string {
    return 'The modified post';
  }
}
