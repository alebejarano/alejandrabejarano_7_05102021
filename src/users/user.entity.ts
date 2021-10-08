import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mail: string;

  @Column()
  password: string;

  /*@Column({ default: true })
  isActive: boolean;*/
}
