import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { CharacterService } from 'src/character/character.service';
import { ROLE } from 'src/constants';
import {
  CANDIDATE_NOT_FOUND,
  FAILED,
  SUCCESS,
  USER_NOT_FOUND,
  WRONG_CODE,
} from 'src/response.messages';
import { Candidate } from './candidate.model';
import { CandidateDto } from './dto/candidate.dto';
import { User } from './user.model';
import { AuthService } from 'src/auth/auth.service';
import { UserLastLogin } from 'src/types/userLastLogin-type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Candidate) private candidateRepository: typeof Candidate,
    private jwtService: JwtService,
    private characterService: CharacterService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async createUserFromEmail(token: string): Promise<User> {
    const user = this.jwtService.verify(token);
    const role = ROLE.PLAYER;
    const condidate = { ...user, roleId: role, ban: false, banReason: '' };
    return await this.userRepository.create(condidate);
  }

  async createUserFromSms(dto: CandidateDto): Promise<User> {
    const candidate = await this.candidateRepository.findOne({
      where: { phone: dto.phone },
    });
    if (!candidate)
      throw new HttpException(CANDIDATE_NOT_FOUND, HttpStatus.NOT_FOUND);

    const { code, password, name, phone } = candidate;
    if (code === dto.code) {
      const role = ROLE.PLAYER;
      const user = {
        name,
        password,
        phone,
        roleId: role,
        ban: false,
        banReason: '',
      };
      return await this.userRepository.create(user);
    } else throw new HttpException(WRONG_CODE, HttpStatus.BAD_REQUEST);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getUserByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { phone },
      include: { all: true },
    });
  }

  async createCandidate(dto: CandidateDto): Promise<Candidate> {
    return await this.candidateRepository.create(dto);
  }

  async getUserById(id: number): Promise<UserLastLogin> {
    const user = await this.userRepository.findOne({
      raw: true,
      where: { id },
      include: { all: true },
    });
    const jwtDate = await this.authService.getLastJwtDateByUserId(id);
    if (!user || !jwtDate)
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    const { tokenId, createdAt } = jwtDate;
    const lastLogin = createdAt;
    const result = Object.assign(user, { lastLogin, tokenId });
    return result;
  }

  async insertOpenedClothes(
    userId: number,
    clothesId: number[],
  ): Promise<ResponseMsg> {
    const insertedToCharacter = await this.characterService.insertOpenedClothes(
      userId,
      clothesId,
    );
    if (insertedToCharacter) return SUCCESS;
    else return FAILED;
  }

  async insertOpenedSubjects(
    userId: number,
    subjectsId: number[],
  ): Promise<ResponseMsg> {
    const insertedToCharacter =
      await this.characterService.insertOpenedSubjects(userId, subjectsId);
    if (insertedToCharacter) return SUCCESS;
    else return FAILED;
  }

  async insertOpenedSkills(
    userId: number,
    skillsId: number[],
  ): Promise<ResponseMsg> {
    const insertedToCharacter = await this.characterService.insertOpenedSkills(
      userId,
      skillsId,
    );
    if (insertedToCharacter) return SUCCESS;
    else return FAILED;
  }
}
