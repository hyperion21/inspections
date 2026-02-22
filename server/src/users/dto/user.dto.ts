import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

export class UserDto {
  @ApiProperty({ example: 'EMP001' })
  employeeId: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
