//Get all posts or get one post
export class PostsResponseDto {
  id: string;
  user_id: string;
  post_content: string;
  //file
}
//Create one post or modify one post
export class CreateAndModifyPostDto {
  post_content: string;
  //file
}
