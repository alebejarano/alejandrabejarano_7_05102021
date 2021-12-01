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
  findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
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
  //Find posts by the userId
  async findPostsByUser(userId): Promise<any> {
    return this.postsRepository.find({
      relations: ['user'],
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    });
  }
  //Create one post
  async createPost(body: CreateAndModifyPostDto): Promise<Post> {
    const newPost = this.postsRepository.create({
      userId: body.userId,
      content: body.content,
    });
    return this.postsRepository.save(newPost);
  }
  //Modify one post and or the file
  async updatePost(
    post: Post,
    filename: string,
    body: CreateAndModifyPostDto,
  ): Promise<any> {
    /*if statement to check if the user already has uploaded a file,
    and if it has a different filename we remove it;
    (if same filename it will be overwritten by multer, 
    so no need to delete)*/
    if (post.file && post.file.length && filename !== post.file) {
      const path = `./files/${post.file}`;
      console.log('post service updatepost');
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
  //Delete file from post
  /*async deleteFile(postId: number): Promise<Post> {
    const post = await this.findById(postId);
    //check if there is a file
    if (post.file && post.file.length) {
      const path = `./files/${post.file}`;
      //if there is a file delete it from folder
      console.log('users service, deletefile');
      fs.unlink(path, (err) => {
        if (err) {
          throw err;
        } else {
          console.log('"Successfully deleted the file."');
        }
      });
    } else {
      console.log('no file to delete');
    }
    post.file = '';
    //return the post with no file
    return this.postsRepository.save(post);
  }*/
  //Delete one post
  async deletePost(postId: number): Promise<Post> {
    const postToDelete = await this.findById(postId);
    return this.postsRepository.remove(postToDelete);
  }
}
