import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ example: 'LOC001' })
  code: string;

  @ApiProperty({ example: 'Location 1' })
  name: string;
}
