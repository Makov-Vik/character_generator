import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CharacterService } from 'src/character/character.service';
import { clothesTable } from 'src/constants';
import {
  FAILED,
  FAILED_FETCH,
  FAIL_WRITE_DB,
  SUCCESS,
} from 'src/response.messages';
import { CharacterClothes } from './character-clothes.model';
import { Clothes } from './clothes.model';
import { CreateClothes } from './dto/create-clothes.dto';

@Injectable()
export class ClothesService {
  constructor(
    @InjectModel(Clothes) private clothesRepository: typeof Clothes,
    @InjectModel(CharacterClothes)
    private characterClothesRepository: typeof CharacterClothes,
    @Inject(forwardRef(() => CharacterService))
    private characterService: CharacterService,
  ) {}

  async getAllClothes(): Promise<Clothes[]> {
    const clothes = await this.clothesRepository.findAll({ where: {} });
    if (!clothes)
      throw new HttpException(FAILED_FETCH, HttpStatus.EXPECTATION_FAILED);
    return clothes;
  }

  async createClothes(dto: CreateClothes): Promise<Clothes> {
    try {
      return await this.clothesRepository.create({ ...dto });
    } catch (_e) {
      throw new HttpException(FAIL_WRITE_DB.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateClothes(id: number, dto: CreateClothes): Promise<ResponseMsg> {
    const [res] = await this.clothesRepository.update(
      { ...dto },
      { where: { id } },
    );
    if (res === 0)
      return new HttpException(FAIL_WRITE_DB, HttpStatus.BAD_REQUEST);
    else return SUCCESS;
  }

  async deleteClothes(id: number): Promise<ResponseMsg> {
    const res = await this.clothesRepository.destroy({ where: { id } });
    if (res === 0) return new HttpException(FAILED, HttpStatus.BAD_REQUEST);
    else return SUCCESS;
  }

  async getSelectedClothes(clothes: number[]): Promise<Clothes[]> {
    const clothesDB = await this.clothesRepository.findAll({
      where: { id: clothes },
    });
    if (!clothesDB)
      throw new HttpException(FAILED_FETCH, HttpStatus.EXPECTATION_FAILED);
    return clothesDB;
  }

  async disableClothes(id: number): Promise<ResponseMsg> {
    const [res] = await this.clothesRepository.update(
      { isActive: false },
      { where: { id } },
    );
    const characterClothes = await this.characterClothesRepository.findAll({
      raw: true,
      attributes: ['characterId'],
      where: { clothesId: id },
    });

    const disableOnPromise = characterClothes.map((item) => {
      return this.characterService.deleteSelectThing(
        item.characterId,
        id,
        clothesTable,
      );
    });

    await Promise.all(disableOnPromise);
    if (res === 0)
      return new HttpException(FAIL_WRITE_DB, HttpStatus.BAD_REQUEST);
    else return SUCCESS;
  }
}
