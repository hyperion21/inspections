import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Location } from '../locations/location.entity';
import { User, UserRole } from '../users/user.entity';
import { AssignInspectionDto } from './dto/assign-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UnassignInspectionDto } from './dto/unassign-inspection.dto';
import { Inspection, InspectionStatus } from './inspection.entity';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private inspectionsRepo: Repository<Inspection>,
    @InjectRepository(Location)
    private locationsRepo: Repository<Location>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async list(status?: InspectionStatus[]): Promise<Inspection[]> {
    const query = this.inspectionsRepo
      .createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.assignedInspector', 'inspector')
      .leftJoinAndSelect('inspection.location', 'location');

    if (status?.length) {
      query.andWhere('inspection.status IN (:...status)', { status });
    }

    return query.getMany();
  }

  async create(dto: CreateInspectionDto): Promise<Inspection> {
    const location = await this.locationsRepo.findOneBy({
      code: dto.locationCode,
    });
    if (!location) throw new NotFoundException('Location not found');

    const inspection = this.inspectionsRepo.create({
      location,
      status: InspectionStatus.YET_TO_START,
      startDateTime: dto.startDateTime,
    });

    return this.inspectionsRepo.save(inspection);
  }

  async assign(id: number, dto: AssignInspectionDto): Promise<Inspection> {
    const inspection = await this.inspectionsRepo.findOne({
      where: { id },
      relations: ['assignedInspector'],
    });
    if (!inspection) throw new NotFoundException('Inspection not found');

    if (inspection.status !== InspectionStatus.YET_TO_START) {
      throw new BadRequestException(
        'Only Yet to Start inspections can be assigned',
      );
    }

    const inspector = await this.usersRepo.findOneBy({
      employeeId: dto.employeeId,
      role: UserRole.INSPECTOR,
    });
    if (!inspector) throw new NotFoundException('Inspector not found');

    inspection.assignedInspector = inspector;
    inspection.startDateTime = dto.startDateTime ?? null;

    return this.inspectionsRepo.save(inspection);
  }

  async unassign(id: number, dto: UnassignInspectionDto): Promise<Inspection> {
    const inspection = await this.inspectionsRepo.findOne({
      where: { id },
      relations: ['assignedInspector'],
    });

    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    inspection.assignedInspector = null;
    inspection.actualStartDateTime = null;
    inspection.endDateTime = null;
    inspection.result = null;
    inspection.comments = null;
    inspection.startDateTime = dto.startDateTime ?? null;
    inspection.status = InspectionStatus.YET_TO_START;

    return this.inspectionsRepo.save(inspection);
  }

  async abandon(id: number): Promise<Inspection> {
    const inspection = await this.inspectionsRepo.findOne({
      where: { id },
    });

    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    if (inspection.status !== InspectionStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Only in progress inspections can be abandoned',
      );
    }

    inspection.assignedInspector = null;
    inspection.actualStartDateTime = null;
    inspection.endDateTime = null;
    inspection.result = null;
    inspection.comments = null;
    inspection.startDateTime = null;
    inspection.status = InspectionStatus.ABANDONED;

    return this.inspectionsRepo.save(inspection);
  }

  async findAssignedToInspector(
    employeeId: string,
    statuses: InspectionStatus[],
  ): Promise<Inspection[]> {
    return this.inspectionsRepo.find({
      where: { assignedInspector: { employeeId }, status: In(statuses) },
      relations: ['assignedInspector'],
    });
  }

  async findOne(id: number): Promise<Inspection> {
    const inspection = await this.inspectionsRepo.findOne({
      where: { id },
      relations: ['assignedInspector', 'location'],
    });

    if (!inspection) throw new NotFoundException('Inspection not found');
    return inspection;
  }

  async startInspection(id: number): Promise<Inspection> {
    const inspection = await this.inspectionsRepo.findOne({
      where: { id, status: InspectionStatus.YET_TO_START },
    });

    if (!inspection)
      throw new NotFoundException('Inspection not found or already started');

    inspection.status = InspectionStatus.IN_PROGRESS;
    inspection.startDateTime = inspection.startDateTime ?? new Date();
    inspection.actualStartDateTime = new Date();

    return this.inspectionsRepo.save(inspection);
  }

  async completeInspection(
    id: number,
    dto: CompleteInspectionDto,
  ): Promise<Inspection> {
    const inspection = await this.inspectionsRepo.findOne({
      where: { id, status: InspectionStatus.IN_PROGRESS },
    });

    if (!inspection)
      throw new NotFoundException('Inspection not found or not in progress');

    inspection.status = InspectionStatus.COMPLETED;
    inspection.endDateTime = new Date();
    inspection.result = dto.result;
    inspection.comments = dto.comments;

    return this.inspectionsRepo.save(inspection);
  }
}
