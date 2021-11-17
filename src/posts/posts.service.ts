import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAndModifyPostDto } from './dto/posts.dto';
import { Post } from './post.entity';
import * as fs from 'fs';

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
  //Modify one post and or the file
  async updatePost(
    userId: number,
    postId: number,
    filename: string,
    body: CreateAndModifyPostDto,
  ): Promise<any> {
    const post = await this.findById(postId);
    if (userId === post.userId) {
      if (post.file && post.file.length && filename !== post.file) {
        const path = `./files/${post.file}`;
        fs.unlink(path, (err) => {
          if (err) {
            throw err;
          } else {
            console.log('"Successfully deleted the file."');
          }
        });
      }
      //update the file and content for the new one
      post.file = filename;
      post.content = body.content;
      return this.postsRepository.save(post);
    }
    /*if statement to check if the user already has uploaded a file,
    and if it has a different filename we remove it;
    (if same filename it will be overwritten by multer, 
    so no need to delete)*/
  }
  //Delete one post
  async deletePost(postId: number): Promise<Post> {
    const postToDelete = await this.findById(postId);
    return this.postsRepository.remove(postToDelete);
  }
}
