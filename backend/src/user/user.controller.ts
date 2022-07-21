import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';
import { ROLE } from 'src/constants';
import { Role } from 'src/auth/checkRole.decorator';
import { User } from './user.model';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  getUserById(@Body() dto: { id: number }): Promise<User> {
    return this.userService.getUserById(dto.id);
  }

  @Post('insert/openedClothes')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  insertOpenedClothes(
    @Body() dto: { id: number; clothesId: number[] },
  ): Promise<ResponseMsg> {
    return this.userService.insertOpenedClothes(dto.id, dto.clothesId);
  }

  @Post('insert/openedSubjects')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  insertOpenedSubjects(
    @Body() dto: { id: number; subjectsId: number[] },
  ): Promise<ResponseMsg> {
    return this.userService.insertOpenedSubjects(dto.id, dto.subjectsId);
  }

  @Post('insert/openedSkills')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  insertOpenedSkills(
    @Body() dto: { id: number; skillsId: number[] },
  ): Promise<ResponseMsg> {
    return this.userService.insertOpenedSkills(dto.id, dto.skillsId);
  }
}
