import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ModifiedUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find(); //SELECT * from user
  }

  async findById(userId: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneOrFail(userId); // SELECT * from user where user.id = id
      return user;
    } catch (err) {
      throw err;
    }
  }

  createUser(name: string, mail: string, password: string): Promise<User> {
    const newUser = this.usersRepository.create({ name, mail, password }); //const newUser = new User(); newUser.name = name
    return this.usersRepository.save(newUser); // Insert the new user to the database
  }

  async updateUser(userId: string, data: ModifiedUserDto): Promise<User> {
    const updateUser = await this.findById(userId);
    updateUser.name = data.name;
    updateUser.mail = data.mail;
    updateUser.password = data.password;

    return this.usersRepository.save(updateUser);
  }

  async deleteUser(userId: string): Promise<User> {
    const user = await this.findById(userId);
    return this.usersRepository.remove(user);
  }
}
