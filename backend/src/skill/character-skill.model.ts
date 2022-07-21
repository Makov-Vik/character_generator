import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Character } from 'src/character/character.model';
import { PRIMARY_KEY } from '../constants';
import { Skill } from './skill.model';

@Table({ tableName: 'character-skill' })
export class CharacterSkill extends Model<CharacterSkill> {
  @Column(PRIMARY_KEY)
  id: number;

  @ForeignKey(() => Character)
  @Column({ type: DataType.INTEGER })
  characterId: number;

  @ForeignKey(() => Skill)
  @Column({ type: DataType.INTEGER })
  skillId: number;
}
