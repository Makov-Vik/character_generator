import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from '../user/user.service';
import * as dotenv from 'dotenv';
import * as env from 'env-var';
import { Candidate } from './candidate.model';
import { CharacterModule } from 'src/character/character.module';
import { AuthModule } from 'src/auth/auth.module';
import { ClothesModule } from 'src/clothes/clothes.module';
dotenv.config();

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    JwtModule.register({
      secret: env.get('PRIVATE_KEY').default('SOME_MSG').required().asString(),
      signOptions: {
        expiresIn: '24h',
      },
    }),
    SequelizeModule.forFeature([User, Candidate]),
    CharacterModule,
    ClothesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
})
export class UserModule {}
