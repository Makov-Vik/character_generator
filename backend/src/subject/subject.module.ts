import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CharacterSubject } from './character-subject.model';
import { Subject } from './subject.model';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CharacterModule } from 'src/character/character.module';

@Module({
  providers: [SubjectService],
  imports: [
    SequelizeModule.forFeature([Subject, CharacterSubject]),
    forwardRef(() => AuthModule),
    forwardRef(() => CharacterModule),
  ],
  controllers: [SubjectController],
  exports: [SubjectService],
})
export class SubjectModule {}
