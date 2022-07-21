import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
  HasOne,
  ForeignKey,
} from 'sequelize-typescript';
import { CharacterClothes } from 'src/clothes/character-clothes.model';
import { Clothes } from 'src/clothes/clothes.model';
import { CharacterSkill } from 'src/skill/character-skill.model';
import { Skill } from 'src/skill/skill.model';
import { CharacterSubject } from 'src/subject/character-subject.model';
import { Subject } from 'src/subject/subject.model';
import { User } from 'src/user/user.model';
import { PRIMARY_KEY } from '../constants';

interface CharacterCreate {
  id: number;
  name: string;
  userId: number;
}

@Table({ tableName: 'character' })
export class Character extends Model<Character, CharacterCreate> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING })
  pathPhoto: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  strength: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  agility: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  endurance: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  intellect: number;

  @BelongsToMany(() => Clothes, () => CharacterClothes)
  clothes: Clothes[];

  @BelongsToMany(() => Skill, () => CharacterSkill)
  skills: Skill[];

  @BelongsToMany(() => Subject, () => CharacterSubject)
  subjects: Subject[];

  @Column({ type: DataType.INTEGER })
  openedClothes: number[];

  @Column({ type: DataType.INTEGER })
  openedSkills: number[];

  @Column({ type: DataType.INTEGER })
  openedSubjects: number[];

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  meleeDamage: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  rangedDamage: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  protection: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  magicDamage: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  healthPoint: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  magicPoint: number;

  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => User)
  userId: number;
}
