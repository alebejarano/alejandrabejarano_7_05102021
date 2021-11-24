/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jtwService: JwtService,
  ) {}
  //verify that the user has a valid email and compare the password
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...rest } = user;
        return rest;
      }
    }
    return null;
  }
  //for the user to login into his account
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jtwService.sign(payload),
      user: user,
      /*user: 
      "profilePic"
      "id"
      "name"
      "email"
      */
    };
  }
}
