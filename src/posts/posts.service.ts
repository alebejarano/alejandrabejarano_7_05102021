import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAndModifyPostDto } from './dto/posts.dto';
import { Post } from './post.entity';
import * as _ from 'lodash';
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
      files: this.getAttrFromString(body.content, 'img', 'src'),
    });
    return this.postsRepository.save(newPost);
  }
  //Modify one post and or the file
  async updatePost(post: Post, body: CreateAndModifyPostDto): Promise<any> {
    /*if statement to check if the user already has uploaded a file,
    and if it has a different filename we remove it;
    (if same filename it will be overwritten by multer, 
    so no need to delete)*/
    /*if (body.files && body.files.length && filename !== body.files) {
      const path = `./files/${body.files}`;
      console.log('post service updatepost');
      fs.unlink(path, (err) => {
        if (err) {
          throw err;
        } else {
          console.log('"Successfully deleted the file."');
        }
      });
    }*/
    const updatedFiles = this.getAttrFromString(body.content, 'img', 'src');
    const filesToDelete = _.difference(post.files, updatedFiles);
    filesToDelete.forEach((file) => {
      const path = `./files/${file}`;
      //console.log('post service updatepost');
      fs.unlink(path, (err) => {
        if (err) {
          throw err;
        } else {
          console.log('"Successfully deleted the file."');
        }
      });
    });
    //update the file and content for the new one
    post.content = body.content;
    post.files = updatedFiles;
    return this.postsRepository.save(post);
  }
  //To like or dislike one post
  async likePost(post: Post, userId): Promise<any> {
    const like = post.likes.find((like) => like == userId);
    if (like) {
      post.likes = post.likes.filter((like) => like != userId);
    } else {
      post.likes.push(userId);
    }
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

  getAttrFromString(str, node, attr) {
    const regex = new RegExp('<' + node + ' .*?' + attr + '="(.*?)"', 'gi');
    let result = [];
    const res = [];
    while ((result = regex.exec(str))) {
      res.push(result[1].split('/file/')[1]);
    }
    return res;
  }
}
