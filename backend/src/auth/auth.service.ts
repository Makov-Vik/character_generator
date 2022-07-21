import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import * as Response from '../response.messages';
import { mailer } from '../nodemailer';
import * as dotenv from 'dotenv';
import * as env from 'env-var';
import { sendSms } from 'src/sms';
import { User } from 'src/user/user.model';
import { JwtDB } from './jwt.model';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { GenerateToken } from './dto/generate-token.dto';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(JwtDB) private jwtRepository: typeof JwtDB,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto): Promise<string> {
    const uuid = uuidv4();
    const user = await this.validateUser(userDto);
    const token = await this.generateToken({ ...user, tokenId: uuid });
    await this.jwtRepository.create({
      userId: user.id,
      jwt: token,
      isActive: true,
      tokenId: uuid,
    });

    return token;
  }

  async logout(userDto: CreateUserDto): Promise<ResponseMsg> {
    let user: User | null = null;
    if (userDto.phone)
      user = await this.userService.getUserByPhone(userDto.phone);
    else if (userDto.email)
      user = await this.userService.getUserByEmail(userDto.email);
    if (!user)
      throw new HttpException(Response.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    try {
      await this.jwtRepository.update(
        { isActive: false },
        { where: { userId: user.id } },
      );
      return Response.LOG_OUT_SUCESS;
    } catch {
      return Response.LOG_OUT_FAILED;
    }
  }

  async registration(userDto: CreateUserDto): Promise<string> {
    const ENCODING_SALT = env.get('ENCODING_SALT').required().asIntPositive();
    const hashPassword = await bcrypt.hash(userDto.password, ENCODING_SALT);

    const dto = { ...userDto };
    dto.password = hashPassword;

    if (dto.email) {
      const candidate = await this.userService.getUserByEmail(dto.email);
      if (candidate) {
        throw new HttpException(Response.SAME_EMAIL, HttpStatus.BAD_REQUEST);
      }
      const token = await this.generateToken(dto);
      const link = `${env
        .get('LINK_HOME_PAGE')
        .required()
        .asString()}/auth/confirmEmail/${token}`;

      const message = {
        to: dto.email,
        subject: 'confirm registration',
        text: '',
        html: `
        <h3>Hello ${dto.name}!</h3>
        <p>Please use this <a href="${link}">link</a> confirm registration.</p>
        `,
      };
      mailer(message);
      return link;
    } else if (dto.phone) {
      const link = `${env
        .get('LINK_HOME_PAGE')
        .required()
        .asString()}/auth/confirmPhone`;
      const code = Array(5)
        .fill(null)
        .map(() => Math.floor(Math.random() * 10))
        .join('');

      await sendSms(
        env.get('FROM_SMS').required().asString(),
        dto.phone,
        `Your code- ${code} .`,
      );
      await this.userService.createCandidate({ ...dto, code });
      return link;
    } else
      throw new HttpException(
        Response.AUTHENTICATED_ERROR,
        HttpStatus.BAD_REQUEST,
      );
  }

  private async generateToken(user: GenerateToken): Promise<string> {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      tokenId: user.tokenId,
      roleId: user.roleId,
    };
    return this.jwtService.sign(payload);
  }

  private async validateUser(userDto: CreateUserDto): Promise<ValidateUser> {
    let user: User | null;
    if (userDto.email) {
      user = await this.userService.getUserByEmail(userDto.email);
      if (!user) {
        throw new UnauthorizedException(Response.WRONG_EMAIL_OR_PASS);
      }
    } else {
      user = await this.userService.getUserByPhone(userDto.phone || '');
      if (!user) {
        throw new UnauthorizedException(Response.WRONG_PHONE_OR_PASS);
      }
    }

    const passwordEqual = await bcrypt.compare(userDto.password, user.password);
    if (!passwordEqual) {
      throw new UnauthorizedException(Response.WRONG_EMAIL_OR_PASS);
    }
    return {
      id: user.id,
      name: user.name,
      password: user.password,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
    };
  }

  async checkIsActive(tokenId: string): Promise<boolean> {
    if (!tokenId) return false;
    const jwt = await this.jwtRepository.findOne({
      attributes: ['isActive'],
      where: { tokenId },
    });
    if (jwt === null) return false;
    return jwt.isActive;
  }

  async getLastJwtDateByUserId(id: number): Promise<JwtDB | null> {
    return await this.jwtRepository.findOne({
      attributes: ['tokenId', 'createdAt'],
      where: { userId: id },
      order: [['createdAt', 'DESC']],
    });
  }
}
