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
import { Clothes } from './clothes.model';
import { ClothesService } from './clothes.service';
import { CreateClothes } from './dto/create-clothes.dto';

@Controller('clothes')
export class ClothesController {
  constructor(private clothesService: ClothesService) {}

  @Get('')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async getAllClothes(): Promise<Clothes[]> {
    return await this.clothesService.getAllClothes();
  }

  @Post('')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async createClothes(@Body() dto: CreateClothes): Promise<Clothes> {
    return this.clothesService.createClothes(dto);
  }

  @Patch('/:id')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async updateClothes(
    @Param('id') id: number,
    @Body() dto: CreateClothes,
  ): Promise<ResponseMsg> {
    return this.clothesService.updateClothes(id, dto);
  }

  @Delete('/:id')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async deleteClothes(@Param('id') id: number): Promise<ResponseMsg> {
    return this.clothesService.deleteClothes(id);
  }

  @Delete('disable/:id')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  async disableClothes(@Param('id') id: string): Promise<ResponseMsg> {
    return this.clothesService.disableClothes(Number(id));
  }
}
