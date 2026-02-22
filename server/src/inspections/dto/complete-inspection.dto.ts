import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';

export class CompleteInspectionDto {
  @ApiProperty({
    enum: ['PASS', 'FAIL'],
    description: 'Result of the inspection.',
  })
  @IsEnum(['PASS', 'FAIL'])
  result: 'PASS' | 'FAIL';

  @ApiProperty({
    description: 'Comments about the inspection.',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @MaxLength(500)
  comments: string;
}
