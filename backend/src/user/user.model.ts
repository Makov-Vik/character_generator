import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Role } from '../role/role.model';
import { PRIMARY_KEY } from '../constants';

interface UserCreate {
  name: string;
  email?: string;
  password: string;
  phone?: string;
  ban: boolean;
  banReason: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreate> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @ForeignKey(() => Role)
  roleId: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  ban: boolean;

  @Column({ type: DataType.STRING })
  banReason: string;
}
