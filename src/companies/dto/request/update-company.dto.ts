import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { USER_ROLE } from 'src/constants/common';

// 所属会社　更新　パラメータ
export class UpdateCompanyDto {
  // 所属会社名
  @ApiProperty({ description: 'company name', type: String })
  @IsOptional()
  @MaxLength(128)
  companyName: string;

  // 所属会社　種別
  @ApiProperty({ description: 'company role', type: Number, enum: USER_ROLE })
  @IsOptional()
  @IsEnum(USER_ROLE)
  companyDiv: number;
  
  // 所属会社名カナ
  @ApiProperty({ description: 'company name kana', type: String })
  @IsOptional()
  @MaxLength(128)
  companyNameKana: string;

  // 工場
  @ApiProperty({ description: 'kojo id', type: Array })
  companyKojoId: number[];

  // 中継地
  @ApiProperty({ description: 'chukei id', type: Array })
  companychukeiId: number[];
}
