import { Injectable } from '@nestjs/common';
import { ModifiedUserDto } from './dto/users.dto';
import { Users } from './interface/users.interface';

@Injectable()
export class UsersService {
  private users: Users[] = [];
  findAll() {
    return this.users;
  }
  findById(userId: string) {
    return this.users.find((user) => user.id === userId);
  }
  createUser(user: Users) {
    this.users.push(user);
    return user;
  }
  updateUser(payload: ModifiedUserDto, userId: string) {
    let updatedStudent: Users;
    const updatedStudentList = this.users.map((user) => {
      if (user.id === userId) {
        updatedStudent = {
          id: userId,
          ...payload,
        };
        return updatedStudent;
      } else return user;
    });
    this.users = updatedStudentList;
    return updatedStudent;
  }
}
