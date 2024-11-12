import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt', //JWT Token
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule {}
