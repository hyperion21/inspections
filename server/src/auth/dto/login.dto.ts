import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'EMP001',
    description: 'Employee ID of the user',
  })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({
    example: 'manager123',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
