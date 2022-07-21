import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { PRIMARY_KEY } from '../constants';

interface JwtCreate {
  userId: number;
  jwt: string;
  isActive: boolean;
  tokenId: string;
}

@Table({ tableName: 'jwt' })
export class JwtDB extends Model<JwtDB, JwtCreate> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  tokenId: string;

  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => User)
  userId: number;

  @Column({ type: DataType.STRING(400) })
  jwt: string;

  @Column({ type: DataType.BOOLEAN })
  isActive: boolean;
}
