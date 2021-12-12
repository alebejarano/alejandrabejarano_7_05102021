import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//automatically provisioned by @nestjs/passport
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
