//Get all posts or get one post
export class PostsResponseDto {
  id: number;
  user_id: number;
  post_content: string;
  //file
}
//Create one post or modify one post
export class CreateAndModifyPostDto {
  post_content: string;
  //file
}
