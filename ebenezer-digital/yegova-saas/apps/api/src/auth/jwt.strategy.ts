import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'ebenezer-dev-secret',
    });
  }

  validate(payload: {
    sub: string;
    email: string;
    shopId: string;
    name?: string;
    role?: string;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      shopId: payload.shopId,
      name: payload.name || '',
      role: payload.role || 'owner',
    };
  }
}
