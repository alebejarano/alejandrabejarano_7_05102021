import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
//configure a Passport strategy by extending the PassportStrategy class
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    //validation happens here, it extracts the token
    //You pass the strategy options by calling the super() method
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  //You provide the verify callback by implementing a validate() method
  //here it returns the value decoded, that has passed validation
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
