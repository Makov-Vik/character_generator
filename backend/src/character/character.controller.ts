import {
  Controller,
  Get,
  Req,
  UseGuards,
  Patch,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { RequestdWithUser } from 'src/types/request-type';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CharacterService } from './character.service';
import { EditCharacterBio } from './dto/edit-character.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './util/image-upload.util';
import { UploadImageDto } from './dto/upload-image.dto';
import { Response } from 'express';
import { EditCharacteristics } from './dto/edit-characteristics.dto';
import { Role } from 'src/auth/checkRole.decorator';
import { ROLE } from 'src/constants';
import { Character } from './character.model';

@Controller('character')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getCharacterPage(@Req() req: RequestdWithUser): Promise<Character> {
    return this.characterService.getCharacterPage(req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  editCharacter(
    @Req() req: RequestdWithUser,
    @Body() dto: EditCharacterBio,
  ): Promise<ResponseMsg> {
    return this.characterService.editCharacter(req, dto);
  }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadImage(
    @UploadedFile() file: UploadImageDto,
    @Req() req: RequestdWithUser,
  ): Promise<ResponseMsg> {
    return this.characterService.uploadImage(file, req);
  }

  @Get('image')
  @UseGuards(JwtAuthGuard)
  getImage(@Req() req: RequestdWithUser, @Res() res: Response): Promise<void> {
    return this.characterService.getImage(req, res);
  }

  @Patch('characteristics')
  @UseGuards(JwtAuthGuard)
  editCharacteristics(
    @Req() req: RequestdWithUser,
    @Body() dto: EditCharacteristics,
  ): Promise<ResponseMsg> {
    return this.characterService.editCharacteristics(req, dto);
  }

  @Get('all')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  getAllCharacters(): Promise<Character[]> {
    return this.characterService.getAllCharacters();
  }

  @Get('admin')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  getCharacterById(@Body() dto: { id: number }): Promise<Character> {
    return this.characterService.getCharacterById(dto.id);
  }
}
