import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
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
import { User, UserRole } from '../users/user.entity';
import { AssignInspectionDto } from './dto/assign-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';
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

  // inspectors
  @Get('assigned')
  @Roles(UserRole.INSPECTOR)
  @ApiOperation({ summary: 'View inspections assigned to the inspector' })
  @ApiResponse({
    status: 200,
    description: 'List of inspections assigned to the inspector',
    type: [InspectionDto],
  })
  listAssigned(
    @Request() req: { user: User },
    @Query('status') status: string,
  ) {
    const statuses: InspectionStatus[] = status
      ? (status.split(',') as InspectionStatus[])
      : [
          InspectionStatus.YET_TO_START,
          InspectionStatus.IN_PROGRESS,
          InspectionStatus.COMPLETED,
        ];
    return this.inspectionsService.findAssignedToInspector(
      req.user.employeeId,
      statuses,
    );
  }

  @Get(':id')
  @Roles(UserRole.INSPECTOR)
  @ApiOperation({ summary: 'View details of a specific inspection' })
  @ApiResponse({
    status: 200,
    description: 'Details of the inspection',
    type: InspectionDto,
  })
  viewDetails(@Param('id') id: string): Promise<Inspection> {
    return this.inspectionsService.findOne(Number(id));
  }

  @Post(':id/start')
  @Roles(UserRole.INSPECTOR)
  @ApiOperation({ summary: 'Move inspection to In Progress' })
  @ApiResponse({
    status: 200,
    description: 'Inspection started',
    type: InspectionDto,
  })
  startInspection(@Param('id') id: string): Promise<Inspection> {
    return this.inspectionsService.startInspection(Number(id));
  }

  @Post(':id/complete')
  @Roles(UserRole.INSPECTOR)
  @ApiOperation({ summary: 'Move inspection to Completed' })
  @ApiResponse({
    status: 200,
    description: 'Inspection completed',
    type: InspectionDto,
  })
  completeInspection(
    @Param('id') id: string,
    @Body() completeInspectionDto: CompleteInspectionDto,
  ): Promise<Inspection> {
    return this.inspectionsService.completeInspection(
      Number(id),
      completeInspectionDto,
    );
  }
}
