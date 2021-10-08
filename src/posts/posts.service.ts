import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  async findById(postId: string): Promise<Post> {
    try {
      const post = await this.postsRepository.findOneOrFail(postId);
      return post;
    } catch (err) {
      throw err;
    }
  }
  //Create one post
  createPost(post: string): Promise<Post> {
    const newPost = this.postsRepository.create({ post });
    return this.postsRepository.save(newPost);
  }
  //Update one post
  async updatePost(postId: string, post: string): Promise<Post> {
    const updatePost = await this.findById(postId);
    updatePost.post = post;
    return this.postsRepository.save(updatePost);
  }
  //Delet one post
  async deletePost(postId: string): Promise<Post> {
    const postToDelete = await this.findById(postId);
    return this.postsRepository.remove(postToDelete);
  }
}
