import { Post } from 'src/posts/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeRemove,
} from 'typeorm';
import * as fs from 'fs';
import { Comment } from 'src/posts/comment.entity';

//Entity is a class that maps to a database table
@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  //empty default value
  profilePic?: string = '';

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @BeforeRemove()
  removeProfilePic() {
    if (this.profilePic && this.profilePic.length) {
      const path = `./files/${this.profilePic}`;
      console.log('users entity');
      if (fs.existsSync(path)) {
        fs.unlink(path, (err) => {
          if (err) {
            throw err;
          } else {
            console.log('"Successfully deleted the file."');
          }
        });
      }
    }
  }

  @OneToMany(() => Post, (post) => post.userId)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
