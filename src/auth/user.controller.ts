import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('auth')
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async registerUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.userService.registerWithEmailAndPassword(
      email,
      password,
    );
    session.userId = user.id;
    return user;
  }

  @Post('/login')
  async loginUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.userService.loginWithEmailAndPassword(
      email,
      password,
    );
    session.userId = user.id;
    return user;
  }

  @Post('/logout')
  logoutUser(@Session() session: any) {
    session.userId = null;
  }

  // @TODO: Dont forget to hash password
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
