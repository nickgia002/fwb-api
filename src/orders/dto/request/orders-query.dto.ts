import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsDateString } from 'class-validator';
import { CommonQueryList } from 'src/utils/api.request';
import { Type, Transform } from 'class-transformer';
import { FLAG_VALUE } from 'src/constants/common';
import { ORDER_ORDER_BY } from 'src/orders/orders.constant';


export class OrdersQueryDto extends CommonQueryList {
  @ApiProperty({ description: 'company', type: String, required: false })
  @IsOptional()
  company?: string;

  @ApiProperty({ required: false, type: [String], example: ['01', '02'] })
  @IsString({ each: true })
  @Transform(({ value }) => (value instanceof Array ? value : [value]))
  @IsOptional()
  stoppingPoint?: string[];

  @ApiProperty({ required: false, type: [String], example: ['01', '02'] })
  @IsString({ each: true })
  @Transform(({ value }) => (value instanceof Array ? value : [value]))
  @IsOptional()
  factory?: string[];

  @ApiProperty({ description: 'propertyNo', type: String, required: false })
  @IsOptional()
  propertyNo?: string;

  @ApiProperty({ description: 'constructionNo', type: String, required: false })
  @IsOptional()
  constructionNo?: string;

  @ApiProperty({ description: 'siteName', type: String, required: false })
  @IsOptional()
  siteName?: string;

  @ApiProperty({ description: 'TorihikiId', type: String, required: false })
  @IsOptional()
  builderId?: string;

  @ApiProperty({ description: 'installationDateFrom', type: String, required: false })
  @IsOptional()
  @IsDateString()
  installationDateFrom?: Date;

  @ApiProperty({ description: 'installationDateTo', type: String, required: false })
  @IsOptional()
  @IsDateString()
  installationDateTo?: Date;

  @ApiProperty({ description: 'shipmentDateFrom', type: String, required: false })
  @IsOptional()
  @IsDateString()
  shipmentDateFrom?: Date;

  @ApiProperty({ description: 'shipmentDateTo', type: String, required: false })
  @IsOptional()
  @IsDateString()
  shipmentDateTo?: Date;

  @ApiProperty({
    description: 'hagaraFlag',
    type: String,
    enum: FLAG_VALUE,
    required: false,
  })
  @IsOptional()
  @IsEnum(FLAG_VALUE)
  @Type(() => Number)
  hagaraFlag?: string;

  @ApiProperty({
    description: 'Order by field',
    type: String,
    required: false,
    // enum: ORDER_ORDER_BY,
  })
  @IsOptional()
  // @IsEnum(ORDER_ORDER_BY)
  sortBy?: string;
}
