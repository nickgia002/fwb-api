import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { USER_ROLE } from 'src/constants/common';
import { IsKatagana, IsPhoneNumberJP } from 'src/users/user.decorator';

export class UpdateAccountDto {
  @ApiProperty({ description: 'User name', type: String })
  @IsOptional()
  @MaxLength(128)
  username?: string;

  @ApiProperty({ description: 'User name kana', type: String })
  @ValidateIf((obj, value) => !!value)
  @MaxLength(128)
  @IsKatagana()
  usernameKana?: string;

  @ApiProperty({ description: 'User email', type: String })
  mailAddress: string;

  @ApiProperty({ description: 'User tel', type: String })
  @ValidateIf((obj, value) => !!value)
  @IsPhoneNumberJP()
  tel?: string;

  @ApiProperty({ description: 'User role', type: Number, enum: USER_ROLE })
  @IsOptional()
  @IsEnum(USER_ROLE)
  roleDiv?: number;
  
  @ApiProperty({ description: 'User newpassword', type: String })
  @IsOptional()
  @MaxLength(50)
  newpassword?: string;
}
