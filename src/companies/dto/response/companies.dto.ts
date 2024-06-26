import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/utils';

// 所属会社リスト　アイテム
export class CompanyItemListDto {
  // 所属会社ID
  @ApiProperty({ description: 'Master company id', type: Number })
  id: number;

  // 所属会社名称
  @ApiProperty({ description: 'Company name', type: String })
  companyName: string;
  
  // 所属会社名称カナ
  @ApiProperty({ description: 'Company name', type: String })
  companyNameKana: string;

  // 種別
  @ApiProperty({ description: 'Company div', type: Number })
  companyDiv: number;

  // 入力日付
  @ApiProperty({ description: 'Created at', type: Date })
  createdAt: Date;

  // 更新日付
  @ApiProperty({ description: 'Updated at', type: Date })
  updatedAt: Date;
}

// 所属会社リスト
export class ListCompanyDto extends CommonListResponse<CompanyItemListDto> {
  @ApiProperty({
    description: 'List company',
    type: CompanyItemListDto,
    isArray: true,
    default: [],
  })
  items: CompanyItemListDto[];
}

// 所属会社詳細　アイテム
export class CompanyDetailDto {
  // 所属会社ID
  @ApiProperty({ description: 'Master user id', type: Number })
  id: number;

  // 所属会社名称
  @ApiProperty({ description: 'Company name', type: String })
  companyName: string;

  // 所属会社名称カナ
  @ApiProperty({ description: 'Company name', type: String })
  companyNameKana: string;
  
  // 種別
  @ApiProperty({ description: 'Company div', type: Number })
  companyDiv: number;

  // 工場
  @ApiProperty({ description: 'kojo id', type: Array })
  companyKojoId: number[];

  // 中継地
  @ApiProperty({ description: 'chukei id', type: Array })
  companychukeiId: number[];

  // 入力者
  @ApiProperty({ description: 'Created by', type: Number })
  createdBy: number;

  // 更新者
  @ApiProperty({ description: 'Updated by', type: Number })
  updatedBy: number;

  // 入力日付
  @ApiProperty({ description: 'Created at', type: Date })
  createdAt: Date;

  // 更新日付
  @ApiProperty({ description: 'Updated at', type: Date })
  updatedAt: Date;
}
