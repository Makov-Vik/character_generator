import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CharacterService } from 'src/character/character.service';
import { subjectTable } from 'src/constants';
import { FAILED, FAIL_WRITE_DB, SUCCESS } from 'src/response.messages';
import { CharacterSubject } from './character-subject.model';
import { CreateSubject } from './dto/create-subject.dto';
import { Subject } from './subject.model';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject) private subjectRepository: typeof Subject,
    @InjectModel(CharacterSubject) private characterSubjectRepository: typeof CharacterSubject,
    @Inject(forwardRef(() => CharacterService))
    private characterService: CharacterService
    ) {}

  async getAllSubjects() {
    return await this.subjectRepository.findAll({ where: {}});
  }

  async createSubject(dto: CreateSubject) {
    try {
      return await this.subjectRepository.create({...dto});
    } catch (_e) {
      return new HttpException(FAIL_WRITE_DB.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSubject(id: number, dto: CreateSubject) {
    const [res] = await this.subjectRepository.update({ ...dto }, { where: { id }});
    if (res === 0) return new HttpException(FAIL_WRITE_DB, HttpStatus.BAD_REQUEST);
    else return SUCCESS;
  }

  async deleteSubject(id: number) {
    const res = await this.subjectRepository.destroy({ where: { id }});
    if (res === 0) return new HttpException(FAILED, HttpStatus.BAD_REQUEST);
    else return SUCCESS;
  }

  async getSelectedSubjects(subjects: number[]) {
    return  await this.subjectRepository.findAll({where: { id: subjects }});
  }

  async disableSubject(id: number) {
    const [res] = await this.subjectRepository.update({ isActive: false }, { where: { id }});
    const characterClothes = await this.characterSubjectRepository.findAll({
      raw: true,
      attributes:['characterId'],
      where: { subjectId: id }
    });

    const disableOnPromise = characterClothes.map(item => {
      return this.characterService.deleteSelectThing(item.characterId, id, subjectTable);
    })

    await Promise.all(disableOnPromise);
    if (res === 0) return new HttpException(FAIL_WRITE_DB, HttpStatus.BAD_REQUEST);
    else return SUCCESS;
  }
}
