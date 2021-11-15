import { Post } from './posts/post.entity';
import { User } from './users/user.entity';

//configuration file, that return an object
export const config = () => ({
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    entities: [User, Post],
  },
});
