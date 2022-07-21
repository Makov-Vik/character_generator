import { IsString, Length, IsEmail, ValidateIf } from 'class-validator';
import * as Response from '../../response.messages';

export class CreateUserDto {
  readonly id: number;
  readonly name: string;

  @ValidateIf((dto) => dto.email)
  @IsString(Response.MUST_BE_STR)
  @IsEmail({}, Response.WRONG_EMAIL)
  readonly email?: string;

  @IsString(Response.MUST_BE_STR)
  readonly phone?: string;

  @IsString(Response.MUST_BE_STR)
  @Length(4, 22, Response.MORE4LESS22)
  readonly password: string;
}
