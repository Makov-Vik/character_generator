import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Character } from 'src/character/character.model';
import { PRIMARY_KEY } from '../constants';
import { Clothes } from './clothes.model';

@Table({ tableName: 'character-clothes' })
export class CharacterClothes extends Model<CharacterClothes> {
  @Column(PRIMARY_KEY)
  id: number;

  @ForeignKey(() => Character)
  @Column({ type: DataType.INTEGER })
  characterId: number;

  @ForeignKey(() => Clothes)
  @Column({ type: DataType.INTEGER })
  clothesId: number;
}
