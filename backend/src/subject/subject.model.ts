import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Character } from 'src/character/character.model';
import { PRIMARY_KEY } from '../constants';
import { CharacterSubject } from './character-subject.model';

interface SubjectCreate {
  name: string;
  description: string;
  strength: number;
  agility: number;
  endurance: number;
  intellect: number;
}

@Table({ tableName: 'subject' })
export class Subject extends Model<Subject, SubjectCreate> {
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

  @BelongsToMany(() => Character, () => CharacterSubject)
  characters: Character[];
}
