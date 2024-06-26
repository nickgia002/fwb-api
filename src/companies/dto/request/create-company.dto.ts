import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { USER_ROLE } from 'src/constants/common';
import { IsKatagana } from 'src/users/user.decorator';

// 所属会社　登録　パラメータ
export class CreateCompanyDto {
  // 所属会社名
  @ApiProperty({ description: 'company name', type: String })
  @IsNotEmpty()
  @MaxLength(128)
  companyName: string;

  // 所属会社名カナ
  @ApiProperty({ description: 'company name Kana', type: String })
  @IsNotEmpty()
  @MaxLength(128)
  @IsKatagana()
  companyNameKana: string;

  // 所属会社　種別
  @ApiProperty({ description: 'company role', type: Number, enum: USER_ROLE })
  @IsNotEmpty()
  @IsEnum(USER_ROLE)
  companyDiv: number;

  // 工場
  @ApiProperty({ description: 'kojo id', type: Array })
  companyKojoId: number[];

  // 中継地
  @ApiProperty({ description: 'chukei id', type: Array })
  companychukeiId: number[];

}
