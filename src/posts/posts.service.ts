import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAndModifyPostDto } from './dto/posts.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}
  //find all post
  finAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }
  //find one post by Id
  async findById(postId: number): Promise<Post> {
    try {
      const post = await this.postsRepository.findOneOrFail(postId);
      return post;
    } catch (err) {
      throw err;
    }
  }
  //Create one post
  createPost(body: CreateAndModifyPostDto): Promise<Post> {
    const newPost = this.postsRepository.create({
      userId: body.userId,
      content: body.content,
      file: body.file || '',
    });
    return this.postsRepository.save(newPost);
  }
  //Modify one post
  async updatePost(
    postId: number,
    body: CreateAndModifyPostDto,
  ): Promise<Post> {
    const updatePost = await this.findById(postId);
    body.content;
    return this.postsRepository.save(updatePost);
  }
  //Delete one post
  async deletePost(postId: number): Promise<Post> {
    const postToDelete = await this.findById(postId);
    return this.postsRepository.remove(postToDelete);
  }
}
