import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../users/roles.decorator';
import { RolesGuard } from '../users/roles.guard';
import { UserRole } from '../users/user.entity';
import { AssignInspectionDto } from './dto/assign-inspection.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { InspectionDto } from './dto/inspection.dto';
import { UnassignInspectionDto } from './dto/unassign-inspection.dto';
import { Inspection, InspectionStatus } from './inspection.entity';
import { InspectionsService } from './inspections.service';

@ApiTags('Inspections')
@ApiBearerAuth()
@Controller('inspections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InspectionsController {
  constructor(private inspectionsService: InspectionsService) {}

  @Get()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'List inspections' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Comma-separated statuses to filter',
  })
  @ApiResponse({
    status: 200,
    description: 'List of inspections',
    type: [InspectionDto],
  })
  list(@Query('status') status?: string): Promise<Inspection[]> {
    let statuses: InspectionStatus[] | undefined;
    if (status) statuses = status.split(',') as InspectionStatus[];
    return this.inspectionsService.list(statuses);
  }

  @Post()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new inspection' })
  @ApiResponse({
    status: 201,
    description: 'Inspection created',
    type: InspectionDto,
  })
  create(@Body() dto: CreateInspectionDto): Promise<Inspection> {
    return this.inspectionsService.create(dto);
  }

  @Patch(':id/abandon')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Abandon an inspection' })
  @ApiResponse({
    status: 200,
    description: 'Inspection abandoned',
    type: InspectionDto,
  })
  abandon(@Param('id') id: string): Promise<Inspection> {
    return this.inspectionsService.abandon(Number(id));
  }

  @Patch(':id/assign')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Assign an inspection to an inspector' })
  @ApiResponse({
    status: 200,
    description: 'Inspection assigned',
    type: InspectionDto,
  })
  assign(
    @Param('id') id: string,
    @Body() dto: AssignInspectionDto,
  ): Promise<Inspection> {
    return this.inspectionsService.assign(Number(id), dto);
  }

  @Patch(':id/unassign')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Unassign an inspector from an inspection' })
  @ApiResponse({
    status: 200,
    description: 'Inspector unassigned',
    type: InspectionDto,
  })
  unassign(
    @Param('id') id: string,
    @Body() dto: UnassignInspectionDto,
  ): Promise<Inspection> {
    return this.inspectionsService.unassign(Number(id), dto);
  }
}
