import { Module, forwardRef } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { Character } from './character.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { ClothesModule } from 'src/clothes/clothes.module';
import { SubjectModule } from 'src/subject/subject.module';
import { SkillModule } from 'src/skill/skill.module';

@Module({
  providers: [CharacterService],
  controllers: [CharacterController],
  imports: [
    SequelizeModule.forFeature([Character]),
    forwardRef(() => AuthModule),
    forwardRef(() => ClothesModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => SkillModule)
  ],
  exports: [CharacterService]
})
export class CharacterModule {}
