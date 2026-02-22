import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  MANAGER = 'MANAGER',
  INSPECTOR = 'INSPECTOR',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  employeeId: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;
}
