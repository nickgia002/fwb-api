import { ApiProperty } from '@nestjs/swagger';

export class ViewSettingsDto {
  @ApiProperty({ description: 'user id', type: String })
  userId: string;

  @ApiProperty({ description: 'setting', type: String })
  viewSettings?: string;
}
