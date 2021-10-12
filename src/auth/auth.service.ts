/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const hash = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(user.password, hash);
      if (isMatch) {
        const { password, ...rest } = user;
        return rest;
      }
    }
    return null;
  }
}
