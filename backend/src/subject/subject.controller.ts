import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/auth/checkRole.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ROLE } from 'src/constants';
import { CreateSubject } from './dto/create-subject.dto';
import { Subject } from './subject.model';
import { SubjectService } from './subject.service';

@Controller('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Get('')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async getAllSubjects(): Promise<Subject[]> {
    return await this.subjectService.getAllSubjects();
  }

  @Post('')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async createSubject(@Body() dto: CreateSubject): Promise<Subject> {
    return this.subjectService.createSubject(dto);
  }

  @Patch('/:id')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async updateSubject(
    @Param('id') id: number,
    @Body() dto: CreateSubject,
  ): Promise<ResponseMsg> {
    return this.subjectService.updateSubject(id, dto);
  }

  @Delete('/:id')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async deleteSubject(@Param('id') id: number): Promise<ResponseMsg> {
    return this.subjectService.deleteSubject(id);
  }

  @Delete('disable/:id')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async disableClothes(@Param('id') id: string): Promise<ResponseMsg> {
    return this.subjectService.disableSubject(Number(id));
  }
}
