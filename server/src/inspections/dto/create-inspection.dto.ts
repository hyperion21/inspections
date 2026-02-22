import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateInspectionDto {
  @ApiProperty({
    example: 'LOC1',
    description: 'Location code for the inspection',
  })
  @IsString()
  locationCode: string;

  @ApiProperty({
    example: '2026-02-22T09:00:00Z',
    description: 'Optional start date/time',
  })
  @IsOptional()
  @IsDateString()
  startDateTime?: Date;
}
