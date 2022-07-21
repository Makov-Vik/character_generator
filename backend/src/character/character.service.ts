import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RequestdWithUser } from 'src/types/request-type';
import {
  CHARACTER_NOT_FOUND,
  FAILED,
  FAIL_WRITE_DB,
  IMAGE_NOT_FOUND,
  NO_SUCH_CHARACTER,
  SUCCESS,
} from 'src/response.messages';
import { Character } from './character.model';
import { CreateCharacter } from './dto/create-character.dto';
import { EditCharacterBio } from './dto/edit-character.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { Response as ExpressResponse } from 'express';
import { EditCharacteristics } from './dto/edit-characteristics.dto';
import { ClothesService } from 'src/clothes/clothes.service';
import { SubjectService } from 'src/subject/subject.service';
import { SkillService } from 'src/skill/skill.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character) private characterRepository: typeof Character,
    @Inject(forwardRef(() => ClothesService))
    private clothesService: ClothesService,
    private subjectService: SubjectService,
    private skillService: SkillService,
    private sequelize: Sequelize,
  ) {}

  async getCharacterById(id: number): Promise<Character> {
    const character = await this.characterRepository.findOne({
      where: { id },
      include: { all: true },
    });
    if (!character)
      throw new HttpException(CHARACTER_NOT_FOUND, HttpStatus.NOT_FOUND);
    else return character;
  }

  async createCharacter(dto: CreateCharacter): Promise<Character> {
    return await this.characterRepository.create({
      ...dto,
      name: 'exampleName',
    });
  }

  async getCharacterPage(req: RequestdWithUser): Promise<Character> {
    const character = await this.getCharacterById(req.user.id);
    if (!character)
      return await this.createCharacter({
        id: req.user.id,
        userId: req.user.id,
      });
    return character;
  }

  async editCharacter(
    req: RequestdWithUser,
    dto: EditCharacterBio,
  ): Promise<ResponseMsg> {
    const character = await this.getCharacterById(req.user.id);
    if (!character)
      return new HttpException(NO_SUCH_CHARACTER, HttpStatus.NOT_FOUND);
    const [res] = await this.characterRepository.update(
      { ...dto },
      { where: { id: req.user.id } },
    );
    if (res === 1) return SUCCESS;
    else return FAILED;
  }

  async uploadImage(
    file: UploadImageDto,
    req: RequestdWithUser,
  ): Promise<ResponseMsg> {
    try {
      this.characterRepository.update(
        { pathPhoto: file.filename },
        {
          where: {
            id: req.user.id,
          },
        },
      );
    } catch (_e) {
      throw new HttpException(FAIL_WRITE_DB, HttpStatus.BAD_REQUEST);
    }

    return SUCCESS;
  }

  async getImage(req: RequestdWithUser, res: ExpressResponse): Promise<void> {
    const character = await this.characterRepository.findOne({
      where: { id: req.user.id },
    });
    if (!character?.pathPhoto) {
      throw new HttpException(IMAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return res.sendFile(character.pathPhoto, { root: './images' });
  }

  async editCharacteristics(
    req: RequestdWithUser,
    dto: EditCharacteristics,
  ): Promise<ResponseMsg> {
    const character = await this.characterRepository.findOne({
      raw: true,
      attributes: ['openedClothes', 'openedSkills', 'openedSubjects'],
      where: { id: req.user.id },
    });
    if (!character)
      throw new HttpException(CHARACTER_NOT_FOUND, HttpStatus.NOT_FOUND);

    const { openedClothes, openedSkills, openedSubjects } = character;
    const resClothes = dto.clothes.every((item) => {
      return openedClothes.includes(item);
    });
    const resSubject = dto.subjects.every((item) => {
      return openedSubjects.includes(item);
    });
    const resSkill = dto.skills.every((item) => {
      return openedSkills.includes(item);
    });
    if ((resClothes && resSkill && resSubject) === false)
      return new HttpException(FAILED, HttpStatus.BAD_REQUEST);

    const characteristics = await Promise.all([
      this.clothesService.getSelectedClothes(dto.clothes),
      this.subjectService.getSelectedSubjects(dto.subjects),
      this.skillService.getSelectedSkills(dto.skills),
    ]);

    const features = {
      strength: 0,
      agility: 0,
      endurance: 0,
      intellect: 0,
    };
    const stats = {
      meleeDamage: 0,
      rangedDamage: 0,
      protection: 0,
      magicDamage: 0,
      healthPoint: 0,
      magicPoint: 0,
    };

    const arsenal: Arsenal[][] = [[], [], []];

    for (let i = 0; i < 3; i++) {
      const sumType = characteristics[i].reduce(
        (item, next) => {
          arsenal[i].push(next);

          return {
            strength: (item.strength += next.strength),
            agility: (item.agility += next.agility),
            endurance: (item.endurance += next.endurance),
            intellect: (item.intellect += next.intellect),
          };
        },
        {
          strength: 0,
          agility: 0,
          endurance: 0,
          intellect: 0,
        },
      );
      features.strength += sumType.strength;
      features.agility += sumType.agility;
      features.endurance += sumType.endurance;
      features.intellect += sumType.intellect;
    }

    for (const key in features) {
      switch (key) {
        case 'strength': {
          stats.meleeDamage = Math.floor(features[key] / 2);
          break;
        }
        case 'agility': {
          stats.rangedDamage = Math.floor(features[key] / 2);
          break;
        }
        case 'endurance': {
          stats.protection = Math.floor(features[key] / 5);
          stats.healthPoint = Math.floor(features[key] / 2);
          break;
        }
        case 'intellect': {
          stats.magicPoint = Math.floor(features[key] / 2);
          stats.magicDamage = Math.floor(features[key] / 5);
          break;
        }
      }
    }

    const inserted = await this.insertFeature(req, features, stats, arsenal);
    if (inserted) return SUCCESS;
    else return new HttpException(FAIL_WRITE_DB, HttpStatus.BAD_REQUEST);
  }

  private async insertFeature(
    req: RequestdWithUser,
    features: FeaturesCharacter,
    stats: StatsCharacter,
    arsenal: Arsenal[][],
  ): Promise<boolean> {
    const clothes = arsenal[0];
    const subjects = arsenal[1];
    const skills = arsenal[2];

    const character = await this.characterRepository.findOne({
      where: { id: req.user.id },
      include: { all: true },
    });
    if (!character)
      throw new HttpException(CHARACTER_NOT_FOUND, HttpStatus.NOT_FOUND);

    let result = true;

    await Promise.all([
      character.$set('clothes', clothes),
      character.$set('subjects', subjects),
      character.$set('skills', skills),
      this.characterRepository.update(
        { ...features, ...stats },
        { where: { id: req.user.id } },
      ),
    ]).catch(() => (result = false));

    return result;
  }

  async getAllCharacters(): Promise<Character[]> {
    const character = await this.characterRepository.findAll({ where: {} });
    if (!character)
      throw new HttpException(CHARACTER_NOT_FOUND, HttpStatus.NOT_FOUND);
    return character;
  }

  async insertOpenedClothes(
    characterId: number,
    clothes: number[],
  ): Promise<boolean> {
    try {
      const openedClothesDB = await this.characterRepository.findOne({
        raw: true,
        attributes: ['openedClothes'],
        where: { id: characterId },
      });
      let openedClothes: number[];
      if (!openedClothesDB) openedClothes = [];
      else openedClothes = openedClothesDB.openedClothes;

      const updatedClothes = Array.from(new Set(openedClothes.concat(clothes)));
      const clothesStr = updatedClothes.join(',');
      await this.sequelize.query(
        `update character set "openedClothes" = '{${clothesStr}}' where id = ${characterId}`,
      );
      return true;
    } catch (_e) {
      return false;
    }
  }

  async insertOpenedSubjects(
    characterId: number,
    subjects: number[],
  ): Promise<boolean> {
    try {
      const openedSubjectDB = await this.characterRepository.findOne({
        raw: true,
        attributes: ['openedSubjects'],
        where: { id: characterId },
      });
      let openedSubjects: number[];
      if (!openedSubjectDB) openedSubjects = [];
      else openedSubjects = openedSubjectDB.openedClothes;

      const updatedClothes = Array.from(
        new Set(openedSubjects.concat(subjects)),
      );
      const subjectsStr = updatedClothes.join(',');
      await this.sequelize.query(
        `update character set "openedSubjects" = '{${subjectsStr}}' where id = ${characterId}`,
      );
      return true;
    } catch (_e) {
      return false;
    }
  }

  async insertOpenedSkills(
    characterId: number,
    skills: number[],
  ): Promise<boolean> {
    try {
      const openedSkillsDB = await this.characterRepository.findOne({
        raw: true,
        attributes: ['openedSkills'],
        where: { id: characterId },
      });
      let openedSkills: number[];
      if (!openedSkillsDB) openedSkills = [];
      else openedSkills = openedSkillsDB.openedClothes;

      const updatedClothes = Array.from(new Set(openedSkills.concat(skills)));
      const skillsStr = updatedClothes.join(',');
      await this.sequelize.query(
        `update character set "openedSkills" = '{${skillsStr}}' where id = ${characterId}`,
      );
      return true;
    } catch (_e) {
      return false;
    }
  }

  async deleteSelectThing(
    characterId: number,
    thingId: number,
    table: Things,
  ): Promise<boolean> {
    try {
      const character = await this.characterRepository.findOne({
        where: { id: characterId },
        include: { all: true },
      });
      if (!character)
        throw new HttpException(CHARACTER_NOT_FOUND, HttpStatus.NOT_FOUND);

      const indexThing = character[table.thing].findIndex(
        (item: { id: number }) => {
          return item.id === thingId;
        },
      );
      if (indexThing > -1) {
        const updateThing = character[`${table.thing}`];
        const updateOpenedThing = character[`${table.openedThing}`];
        const indexOpenedThing = character[`${table.openedThing}`].findIndex(
          (item) => {
            return item === thingId;
          },
        );
        updateThing.splice(indexThing, 1);
        updateOpenedThing.splice(indexOpenedThing, 1);
        await this.sequelize.query(
          `update character set "${table.openedThing}" = '{${updateOpenedThing}}'
          where id = ${characterId}`,
        );
        await character.$set(table.thing, updateThing);
      } else {
        const indexOpenedThing = character[`${table.openedThing}`].findIndex(
          (item) => {
            return item === thingId;
          },
        );
        if (indexOpenedThing > -1) {
          const updateOpenedThing = character[`${table.openedThing}`];
          updateOpenedThing.splice(indexOpenedThing, 1);
          await this.sequelize.query(
            `update character set "${table.openedThing}" = '{${updateOpenedThing}}'
            where id = ${characterId}`,
          );
        }
      }
      return true;
    } catch (_e) {
      return false;
    }
  }
}
