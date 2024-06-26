import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { USER_ROLE } from 'src/constants/common';
import { COMPANY_ORDER_BY } from 'src/companies/companies.constant';
import { CommonQueryList } from 'src/utils/api.request';

// 所属会社　検索条件パラメータ
export class CompaniesQueryDto extends CommonQueryList {
  // 所属会社ID
  @ApiProperty({ description: 'Company id', type: String, required: false })
  companyId?: string;

  // 所属会社名称
  @ApiProperty({ description: 'Company name', type: String, required: false })
  companyName?: string;

  // 所属会社種別
  @ApiProperty({ 
    description: 'Company role',
    type: String,
    required: false,
    enum: Object.keys(USER_ROLE).slice(0, Object.keys(USER_ROLE).length / 2),
  })
  @IsOptional()
  @IsEnum(Object.keys(USER_ROLE).slice(0, Object.keys(USER_ROLE).length / 2))
  CompanyDiv?: number;

  // 並び順
  @ApiProperty({
    description: 'Order by field',
    type: String,
    required: false,
    enum: COMPANY_ORDER_BY,
  })
  @IsOptional()
  @IsEnum(COMPANY_ORDER_BY)
  sortBy?: string;
}

// 所属会社　検索条件パラメータ
export class AllCompaniesQueryDto extends CommonQueryList {

  // ユーザー権限
  @ApiProperty({ 
    description: 'Company role',
    type: String,
    required: false,
    enum: Object.keys(USER_ROLE).slice(0, Object.keys(USER_ROLE).length / 2),
  })
  @IsOptional()
  @IsEnum(Object.keys(USER_ROLE).slice(0, Object.keys(USER_ROLE).length / 2))
  authority?: string;

  // 並び順
  @ApiProperty({
    description: 'Order by field',
    type: String,
    required: false,
    enum: COMPANY_ORDER_BY,
  })
  @IsOptional()
  @IsEnum(COMPANY_ORDER_BY)
  sortBy?: string;
}