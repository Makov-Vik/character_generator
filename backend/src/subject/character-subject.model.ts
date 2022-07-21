import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Character } from 'src/character/character.model';
import { PRIMARY_KEY } from '../constants';
import { Subject } from './subject.model';

@Table({ tableName: 'character-subject' })
export class CharacterSubject extends Model<CharacterSubject> {
  @Column(PRIMARY_KEY)
  id: number;

  @ForeignKey(() => Character)
  @Column({ type: DataType.INTEGER })
  characterId: number;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER })
  subjectId: number;
}
