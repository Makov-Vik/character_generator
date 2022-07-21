import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Character } from 'src/character/character.model';
import { PRIMARY_KEY } from '../constants';
import { CharacterClothes } from './character-clothes.model';

interface ClothesCreate {
  name: string;
  description: string;
  strength: number;
  agility: number;
  endurance: number;
  intellect: number;
}

@Table({ tableName: 'clothes' })
export class Clothes extends Model<Clothes, ClothesCreate> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.INTEGER })
  strength: number;

  @Column({ type: DataType.INTEGER })
  agility: number;

  @Column({ type: DataType.INTEGER })
  endurance: number;

  @Column({ type: DataType.INTEGER })
  intellect: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @BelongsToMany(() => Character, () => CharacterClothes)
  characters: Character[];
}
