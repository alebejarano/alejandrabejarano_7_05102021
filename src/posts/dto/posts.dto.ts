import { IsNumber, IsString } from 'class-validator';

//Get all posts or get one post
export class PostsResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  user_id: number;

  @IsString()
  post_content: string;
  //file
}
//Create one post or modify one post
export class CreateAndModifyPostDto {
  @IsString()
  post_content: string;
  //file
}
