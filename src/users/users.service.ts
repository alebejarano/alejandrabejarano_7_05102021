import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, ModifiedUserDto } from './dto/users.dto';
export type UserTest = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<UserTest | undefined> {
    return this.users.find((user) => user.username === username);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find(); //SELECT * from user
  }

  async findById(userId: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneOrFail(userId); // SELECT * from user where user.id = id
      return user;
    } catch (err) {
      throw err;
    }
  }
  //This will be for the authentification process in auth service
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    return user;
  }

  createUser(data: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(data);
    return this.usersRepository.save(newUser); // Insert the new user to the database
  }

  async updateUser(userId: number, data: ModifiedUserDto): Promise<User> {
    const updateUser = await this.findById(userId);
    updateUser.name = data.name;
    updateUser.email = data.email;
    updateUser.password = data.password;

    return this.usersRepository.save(updateUser);
  }

  async deleteUser(userId: number): Promise<User> {
    const user = await this.findById(userId);
    return this.usersRepository.remove(user);
  }
}
