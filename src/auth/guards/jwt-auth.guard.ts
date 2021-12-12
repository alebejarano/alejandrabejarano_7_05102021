import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//we define the JwtAuthGuard class which extends the built-in AuthGuard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
