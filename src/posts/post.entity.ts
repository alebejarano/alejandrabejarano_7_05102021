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

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  createdAt: string;

  @Column()
  file?: string = '';

  @BeforeRemove()
  removeFile() {
    if (this.file && this.file.length) {
      const path = `./files/${this.file}`;
      console.log('post entity');
      fs.unlink(path, (err) => {
        if (err) {
          throw err;
        } else {
          console.log('"Successfully deleted the file."');
        }
      });
    }
  }

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;
}
