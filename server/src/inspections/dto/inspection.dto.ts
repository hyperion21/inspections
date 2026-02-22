import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from '../../locations/dto/location.dto';
import { UserDto } from '../../users/dto/user.dto';
import { InspectionStatus } from '../inspection.entity';

export class InspectionDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: InspectionStatus })
  status: InspectionStatus;

  @ApiProperty({ type: () => LocationDto })
  location: LocationDto;

  @ApiProperty({ type: () => UserDto, nullable: true })
  assignedInspector?: UserDto;

  @ApiProperty({ nullable: true })
  startDateTime?: Date;

  @ApiProperty({ nullable: true })
  actualStartDateTime?: Date;

  @ApiProperty({ nullable: true })
  endDateTime?: Date;

  @ApiProperty({ enum: ['PASS', 'FAIL'], nullable: true })
  result?: 'PASS' | 'FAIL';

  @ApiProperty({ nullable: true })
  comments?: string;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty()
  lastUpdatedDate: Date;
}
