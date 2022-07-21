import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Character } from 'src/character/character.model';
import { PRIMARY_KEY } from '../constants';
import { CharacterSkill } from './character-skill.model';

interface SkillCreate {
  name: string;
  description: string;
  strength: number;
  agility: number;
  endurance: number;
  intellect: number;
}

@Table({ tableName: 'skill' })
export class Skill extends Model<Skill, SkillCreate> {
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

  @BelongsToMany(() => Character, () => CharacterSkill)
  characters: Character[];
}
