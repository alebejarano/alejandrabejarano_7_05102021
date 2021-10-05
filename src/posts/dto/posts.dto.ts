//Get all posts or get one post
export class PostsResponseDto {
  id: string;
  user_id: string;
  post_content: string;
  //file
}
//Create one post
export class CreatePostDto {
  id: string;
  user_id: string;
  post_content: string;
  //file
}
//Modify the post
export class ModifyPostDto {
  post_content: string;
  //file
}
