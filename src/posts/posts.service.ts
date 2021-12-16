import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAndModifyPostDto, CreateCommentDto } from './dto/posts.dto';
import { Post } from './post.entity';
import * as _ from 'lodash';
import * as fs from 'fs';
import { Comment } from './comment.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  //find all post
  findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user', 'comments', 'comments.user'],
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
      relations: ['user', 'comments', 'comments.user'],
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

  //Delete one post
  async deletePost(postId: number, userId: number): Promise<Post> {
    try {
      const postToDelete = await this.findById(postId);
      const user = await this.usersRepository.findOneOrFail(userId);
      if (postToDelete.userId === userId || user.isAdmin) {
        return this.postsRepository.remove(postToDelete);
      }
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } catch (err) {
      throw err;
    }
  }

  //create a comment
  async createComment(
    post: Post,
    userId: number,
    body: CreateCommentDto,
  ): Promise<any> {
    const comment = this.commentsRepository.create({
      content: body.content,
      postId: post.id,
      userId: userId,
    });
    return this.commentsRepository.save(comment);
  }

  //To delete a comment
  async deleteComment(userId: number, commentId) {
    try {
      const comment = await this.commentsRepository.findOneOrFail(commentId);
      const user = await this.usersRepository.findOneOrFail(userId);
      if (comment.userId === userId || user.isAdmin) {
        return this.commentsRepository.remove(comment);
      }
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } catch (err) {
      throw err;
    }
  }

  //to get the file from our string handed by quill, thata contains our file, so we can delete from our static folder
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
