import { Controller, Get, Param, Post, Put } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get()
  getAllPosts(): string {
    return 'All the posts';
  }
  @Get('/:postId')
  getPostById(@Param('postId') postId: string): string {
    return `The id post: ${postId}`;
  }
  @Post()
  createPost(): string {
    return 'The post created';
  }
  @Put('/:postId')
  modifyPost(@Param('postId') postId: string): string {
    return `The modified post with id of ${postId}`;
  }
}
