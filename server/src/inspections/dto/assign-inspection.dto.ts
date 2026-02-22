import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AssignInspectionDto {
  @ApiProperty({
    example: 'EMP101',
    description: 'Inspector Employee ID to assign',
  })
  @IsString()
  employeeId: string;

  @ApiProperty({
    example: '2026-02-22T09:00:00Z',
    description: 'Optional start date/time',
  })
  @IsOptional()
  @IsDateString()
  startDateTime?: Date;
}
