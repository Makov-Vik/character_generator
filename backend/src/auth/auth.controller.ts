import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../pipe/validation.pipe';
import { UserService } from 'src/user/user.service';
import { CandidateDto } from 'src/user/dto/candidate.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from 'src/user/user.model';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UsePipes(ValidationPipe)
  @Get('/login')
  login(@Body() userDto: CreateUserDto): Promise<string> {
    return this.authService.login(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout(@Body() userDto: CreateUserDto): Promise<ResponseMsg> {
    return this.authService.logout(userDto);
  }

  @UsePipes(ValidationPipe)
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto): Promise<string> {
    return this.authService.registration(userDto);
  }

  @Get('/confirmEmail/:token')
  async confirmEmail(@Param('token') token: string): Promise<User> {
    return this.userService.createUserFromEmail(token);
  }

  @Post('/confirmPhone')
  async confirmPhone(@Body() candidate: CandidateDto): Promise<User> {
    return this.userService.createUserFromSms(candidate);
  }
}
