import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayLoad } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  //already verify at this point, get the user to authorize tasks
  async validate(payload: JwtPayLoad) {
    const { username } = payload;
    const user = await this.prisma.user.findFirst({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
