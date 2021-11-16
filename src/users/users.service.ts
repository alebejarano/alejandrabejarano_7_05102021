import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdatedUserDto } from './dto/users.dto';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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
    // Insert the new user to the database
    return this.usersRepository.save(newUser);
  }

  async updateUser(userId: number, data: UpdatedUserDto): Promise<User> {
    const updateUser = await this.findById(userId);
    updateUser.name = data.name;
    updateUser.email = data.email;
    updateUser.password = data.password;

    return this.usersRepository.save(updateUser);
  }

  async UpdateProfilePic(userId: number, filename: string): Promise<string> {
    const user = await this.findById(userId);
    /*if statement to check if the user already has a profile pic,
    and has a different filename we remove it;
    (if same filename it will be overwritten by multer, 
    so no need to delete)*/
    if (
      user.profilePic &&
      user.profilePic.length &&
      filename !== user.profilePic
    ) {
      const path = `./files/${user.profilePic}`;
      fs.unlink(path, (err) => {
        if (err) {
          throw err;
        } else {
          console.log('"Successfully deleted the file."');
        }
      });
    }
    user.profilePic = filename;
    this.usersRepository.save(user);
    return filename;
  }

  async deleteUser(userId: number): Promise<User> {
    const user = await this.findById(userId);
    return this.usersRepository.remove(user);
  }

  async deleteProfilePic(userId: number): Promise<User> {
    const user = await this.findById(userId);
    if (user.profilePic && user.profilePic.length) {
      const path = `./files/${user.profilePic}`;
      fs.unlink(path, (err) => {
        if (err) {
          throw err;
        } else {
          console.log('"Successfully deleted the file."');
        }
      });
    }
    user.profilePic = '';
    return this.usersRepository.save(user);
  }
}
