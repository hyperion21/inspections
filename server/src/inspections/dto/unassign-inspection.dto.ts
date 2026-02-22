import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UnassignInspectionDto {
  @ApiProperty({
    example: '2026-02-22T09:00:00Z',
    description: 'Optional start date/time',
  })
  @IsOptional()
  @IsDateString()
  startDateTime?: Date;
}
