import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/utils';

export class AccountItemListDto {
  @ApiProperty({ description: 'Master user id', type: Number })
  id: number;

  @ApiProperty({ description: 'User id', type: String })
  userId: string;

  @ApiProperty({ description: 'User name', type: String })
  username: string;

  @ApiProperty({ description: 'User name kana', type: String, required: false })
  usernameKana?: string;

  @ApiProperty({ description: 'Mail address', type: String })
  mailAddress: string;

  @ApiProperty({ description: 'Role div', type: Number })
  roleDiv: number;

  @ApiProperty({ description: 'Tel', type: String, required: false })
  tel?: string;

  @ApiProperty({ description: 'Created at', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', type: Date })
  updatedAt: Date;
}

export class ListAccountDto extends CommonListResponse<AccountItemListDto> {
  @ApiProperty({
    description: 'List users',
    type: AccountItemListDto,
    isArray: true,
    default: [],
  })
  items: AccountItemListDto[];
}

export class AccountDetailDto {
  @ApiProperty({ description: 'Master user id', type: Number })
  id: number;

  @ApiProperty({ description: 'User id', type: String })
  userId: string;

  @ApiProperty({ description: 'User name', type: String })
  username: string;

  @ApiProperty({ description: 'User name kana', type: String, required: false })
  usernameKana?: string;

  @ApiProperty({ description: 'Mail address', type: String })
  mailAddress: string;

  @ApiProperty({ description: 'Role div', type: Number })
  roleDiv: number;

  @ApiProperty({ description: 'Created by', type: Number })
  createdBy: number;

  @ApiProperty({ description: 'Updated by', type: Number })
  updatedBy: number;

  @ApiProperty({ description: 'Tel', type: String, required: false })
  tel?: string;

}
