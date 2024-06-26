import { ApiProperty } from '@nestjs/swagger';

export class SelectDto {
  @ApiProperty({ description: 'value', type: String })
  value: string;

  @ApiProperty({ description: 'label', type: String })
  label: string;
}
