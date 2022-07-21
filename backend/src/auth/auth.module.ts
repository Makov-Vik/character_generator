import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as env from 'env-var';
import { JwtDB } from './jwt.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtStrategy } from './strategies/jwt.strategy';
dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    forwardRef(() => UserModule),
    SequelizeModule.forFeature([JwtDB]),
    JwtModule.register({
      secret: env.get('PRIVATE_KEY').default('SOME_MSG').required().asString(),
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
