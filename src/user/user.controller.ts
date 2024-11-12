import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';
import { UserService } from './user.service';
import { SignInDTO } from './dto/signin.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(
    @Body()
    userData: {
      name?: string;
      email: string;
      username: string;
      password: string;
      age: number;
      isAdmin: false;
    },
  ): Promise<UserModel> {
    const salt = await genSalt();
    return this.userService.createUser({
      ...userData,
      salt,
      password: await this.hashPassword(userData.password, salt),
    });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    const encryptedPass = await hash(password, salt);
    return encryptedPass;
  }

  @Post('/signIn')
  signIn(
    @Body(ValidationPipe) dto: SignInDTO,
  ): Promise<{ accessToken: string }> {
    // this.eventEmitter.emit('create.event', dto);
    return this.userService.signIn(dto);
  }

  @Get('/users')
  async getAll(): Promise<UserModel[]> {
    return this.userService.users({});
  }
}
