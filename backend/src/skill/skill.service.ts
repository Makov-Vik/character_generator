import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CharacterService } from 'src/character/character.service';
import { skillTable } from 'src/constants';
import { FAILED, FAIL_WRITE_DB, SUCCESS } from 'src/response.messages';
import { CharacterSkill } from './character-skill.model';
import { CreateSkill } from './dto/create-skill.dto';
import { Skill } from './skill.model';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill) private skillRepository: typeof Skill,
    @InjectModel(CharacterSkill) private characterSkillRepository: typeof CharacterSkill,
    @Inject(forwardRef(() => CharacterService))
    private characterService: CharacterService
    ) {}

  async getAllSkills() {
    return await this.skillRepository.findAll({ where: {}});
  }

  async createSkill(dto: CreateSkill) {
    try {
      return await this.skillRepository.create({...dto});
    } catch (_e) {
      return new HttpException(FAIL_WRITE_DB.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSkill(id: number, dto: CreateSkill) {
    const [res] = await this.skillRepository.update({ ...dto }, { where: { id }});
    if (res === 0) return new HttpException(FAIL_WRITE_DB, HttpStatus.BAD_REQUEST);
    else return SUCCESS;
  }

  async deleteSkill(id: number) {
    const res = await this.skillRepository.destroy({ where: { id }});
    if (res === 0) return new HttpException(FAILED, HttpStatus.BAD_REQUEST);
    else return SUCCESS;
  }

  async getSelectedSkills(skills: number[]) {
    return  await this.skillRepository.findAll({where: { id: skills }});
  }

  async disableSkill(id: number) {
    const [res] = await this.skillRepository.update({ isActive: false }, { where: { id }});
    const characterClothes = await this.characterSkillRepository.findAll({
      raw: true,
      attributes:['characterId'],
      where: { skillId: id }
    });

    const disableOnPromise = characterClothes.map(item => {
      return this.characterService.deleteSelectThing(item.characterId, id, skillTable);
    })

    await Promise.all(disableOnPromise);
    if (res === 0) return new HttpException(FAIL_WRITE_DB, HttpStatus.BAD_REQUEST);
    else return SUCCESS;
  }
}
