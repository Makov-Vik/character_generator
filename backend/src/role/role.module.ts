import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './role.model';
import { RoleService } from './role.service';

@Module({
  providers: [RoleService],
  imports: [SequelizeModule.forFeature([Role])],
})
export class RoleModule {}
