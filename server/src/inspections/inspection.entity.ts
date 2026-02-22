import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Location } from '../locations/location.entity';
import { User } from '../users/user.entity';

export enum InspectionStatus {
  YET_TO_START = 'YET_TO_START',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export type InspectionResult = 'PASS' | 'FAIL';

@Entity()
@Index('IDX_inspection_status', ['status'])
export class Inspection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Location, { eager: true })
  location: Location;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.YET_TO_START,
  })
  status: InspectionStatus;

  @ManyToOne(() => User, { nullable: true })
  @Index()
  assignedInspector: User | null;

  @Column({ type: 'datetime', nullable: true })
  startDateTime: Date | null;

  @Column({ type: 'datetime', nullable: true })
  actualStartDateTime: Date | null;

  @Column({ type: 'datetime', nullable: true })
  endDateTime: Date | null;

  @Column({
    type: 'enum',
    enum: ['PASS', 'FAIL'],
    nullable: true,
  })
  result: InspectionResult | null;

  @Column({ type: 'text', nullable: true })
  comments: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  lastUpdatedDate: Date;
}
