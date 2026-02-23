import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../users/roles.decorator';
import { RolesGuard } from '../users/roles.guard';
import { UserRole } from '../users/user.entity';
import { LocationDto } from './dto/location.dto';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@ApiBearerAuth()
@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({
    status: 200,
    description: 'List of all locations',
    type: [LocationDto],
  })
  async getAllLocations(): Promise<LocationDto[]> {
    return this.locationsService.findAll();
  }
}
