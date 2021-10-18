import { Post } from 'src/posts/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

  /*@Column({ default: true })
  isActive: boolean;*/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Post, (post) => post.userId)
  posts: Post[];
}
