import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as env from 'env-var';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { CharacterModule } from './character/character.module';
import { SubjectModule } from './subject/subject.module';
import { SkillModule } from './skill/skill.module';
import { ClothesModule } from './clothes/clothes.module';
import { User } from './user/user.model';
import { Character } from './character/character.model';
import { Subject } from './subject/subject.model';
import { CharacterSubject } from './subject/character-subject.model';
import { Skill } from './skill/skill.model';
import { CharacterSkill } from './skill/character-skill.model';
import { Role } from './role/role.model';
import { Clothes } from './clothes/clothes.model';
import { CharacterClothes } from './clothes/character-clothes.model';
import { Candidate } from './user/candidate.model';
import { JwtDB } from './auth/jwt.model';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    MongooseModule.forRoot(env.get('MONGO_URI').required().asString()),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: env.get('POSTGRES_HOST').required().asString(),
      port: env.get('POSTGRES_PORT').required().asIntPositive(),
      username: env.get('POSTGRES_USER').required().asString(),
      password: env.get('POSTGRES_PASSWORD').required().asString(),
      database: env.get('POSTGRES_DB').required().asString(),
      models: [
        User,
        Character,
        Subject,
        CharacterSubject,
        Skill,
        CharacterSkill,
        Role,
        Clothes,
        CharacterClothes,
        Candidate,
        JwtDB,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    RoleModule,
    CharacterModule,
    SubjectModule,
    SkillModule,
    ClothesModule,
  ],
})
export class AppModule {}
