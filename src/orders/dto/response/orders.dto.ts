import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/utils';

export class OrderDto {
  @ApiProperty({ description: 'HeaderId', type: Number })
  HeaderId: number;

  @ApiProperty({ description: 'KoteiDetailId', type: Number })
  KoteiDetailId: number;

  @ApiProperty({ description: 'ShukaGembaHanyuId', type: Number })
  ShukaGembaHanyuId?: number;

  @ApiProperty({ description: '', type: Number })
  StatusId?: number;

  @ApiProperty({ description: '', type: String })
  constructionNo?: string;

  @ApiProperty({ description: '', type: String })
  propertyNo?: string;

  @ApiProperty({ description: '', type: String })
  siteMap?: string;
  
  @ApiProperty({ description: '', type: String })
  siteName?: string;

  @ApiProperty({ description: '', type: String })
  buildingNo?: string;

  @ApiProperty({ description: '', type: String })
  numOfBuildings?: string;

  @ApiProperty({ description: '', type: String })
  structure?: string;

  @ApiProperty({ description: '', type: String })
  tsubos?: string;

  @ApiProperty({ description: '', type: String })
  builder?: string;

  @ApiProperty({ description: '', type: String })
  constructionCompany?: string;

  @ApiProperty({ description: '', type: String })
  directorName?: string;

  @ApiProperty({ description: '', type: String })
  telephoneNumber?: string;

  @ApiProperty({ description: '', type: String })
  structureFactory?: string;

  @ApiProperty({ description: '', type: Date })
  structureShipmentDate?: Date; 

  @ApiProperty({ description: '', type: Date })
  structureStoppingPointArriveAt?: Date; 

  @ApiProperty({ description: '', type: String })
  hagaraFactory?: string;

  @ApiProperty({ description: '', type: Date })
  hagaraShipmentDate?: Date; 

  @ApiProperty({ description: '', type: Date })
  hagaraStoppingPointArriveAt?: Date; 

  @ApiProperty({ description: '', type: String })
  idsPlant?: string;

  @ApiProperty({ description: '', type: String })
  lvlPlant?: string;

  @ApiProperty({ description: '', type: String })
  subcontractor?: string;

  @ApiProperty({ description: '', type: Date })
  subcontractorShipmentDate?: Date; 

  @ApiProperty({ description: '', type: Date })
  subcontractorStoppingPointArriveAt?: Date; 

  @ApiProperty({ description: '', type: Date })
  approveDate?: Date; 

  @ApiProperty({ description: '', type: String })
  vehicle?: string;

  @ApiProperty({ description: '', type: String })
  wrecker?: string;

  @ApiProperty({ description: '', type: String })
  planned1fStructure?: string;

  @ApiProperty({ description: '', type: String })
  confirm?: string; 

  @ApiProperty({ description: '', type: String })
  SharedLink?: string;

  @ApiProperty({ description: '', type: String })
  SharedLink2?: string;

  @ApiProperty({ description: '', type: String })
  SharedLink3?: string;

  @ApiProperty({ description: '', type: String })
  supervisoryInstructions?: string;

  @ApiProperty({ description: '', type: String })
  featherPattern1?: string;

  @ApiProperty({ description: '', type: Date })
  installationDate1?: Date; 

  @ApiProperty({ description: '', type: String })
  time1?: string;

  @ApiProperty({ description: '', type: String })
  itemsDelivered1?: string;

  @ApiProperty({ description: '', type: String })
  featherPattern2?: string;

  @ApiProperty({ description: '', type: Date })
  installationDate2?: Date; 

  @ApiProperty({ description: '', type: String })
  time2?: string;

  @ApiProperty({ description: '', type: String })
  itemsDelivered2?: string;

  @ApiProperty({ description: '', type: String })
  featherPattern3?: string;

  @ApiProperty({ description: '', type: Date })
  installationDate3?: Date; 

  @ApiProperty({ description: '', type: String })
  time3?: string;

  @ApiProperty({ description: '', type: String })
  itemsDelivered3?: string;

  @ApiProperty({ description: '', type: String })
  featherPattern4?: string;

  @ApiProperty({ description: '', type: Date })
  installationDate4?: Date; 

  @ApiProperty({ description: '', type: String })
  time4?: string;

  @ApiProperty({ description: '', type: String })
  itemsDelivered4?: string;

  @ApiProperty({ description: '', type: String })
  featherPattern5?: string;

  @ApiProperty({ description: '', type: Date })
  installationDate5?: Date; 

  @ApiProperty({ description: '', type: String })
  time5?: string;

  @ApiProperty({ description: '', type: String })
  itemsDelivered5?: string;

  @ApiProperty({ description: '', type: String })
  featherPattern6?: string;

  @ApiProperty({ description: '', type: Date })
  installationDate6?: Date; 

  @ApiProperty({ description: '', type: String })
  time6?: string;

  @ApiProperty({ description: '', type: String })
  itemsDelivered6?: string;

  @ApiProperty({ description: '', type: String })
  SekouName?: string;

  @ApiProperty({ description: '', type: Boolean })
  HaisoEnki?: boolean;

  @ApiProperty({ description: '', type: String })
  HaisoEnkiDisp?: string;

  @ApiProperty({ description: '', type: String })
  KoubaiNedaCdName?: string;

}

export class ListOrderDto extends CommonListResponse<OrderDto> {
  @ApiProperty({
    description: 'List orders',
    type: OrderDto,
    isArray: true,
    default: [],
  })
  items: OrderDto[];
}

