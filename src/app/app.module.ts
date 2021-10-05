import { Module } from '@nestjs/common';
import { PostsController } from 'src/posts/posts.controller';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { UsersController } from '../users/users.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController, PostsController],
  providers: [AppService],
})
export class AppModule {}
