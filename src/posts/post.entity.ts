import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeRemove,
} from 'typeorm';
import * as fs from 'fs';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @Column()
  content: string;

  @Column()
  file?: string;

  @BeforeRemove()
  removeFile() {
    const path = `./files/${this.file}`;
    fs.unlink(path, (err) => {
      if (err) {
        throw err;
      } else {
        console.log('"Successfully deleted the file."');
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => User, (user) => user.posts)
  user: User;
}
