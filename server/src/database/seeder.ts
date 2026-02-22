import { INestApplication } from '@nestjs/common';
import { LocationsService } from '../locations/locations.service';
import { UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';

export async function runSeeders(app: INestApplication) {
  const usersService = app.get(UsersService);
  const locationsService = app.get(LocationsService);

  console.log('Seeding database...');

  const existingManager = await usersService.findByEmployeeId('EMP001');
  if (!existingManager) {
    const managerPassword = await usersService.hashPassword('manager123');
    await usersService.create({
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Manager',
      role: UserRole.MANAGER,
      password: managerPassword,
    });

    for (let i = 1; i <= 5; i++) {
      const inspectorPassword = await usersService.hashPassword('inspector123');
      await usersService.create({
        employeeId: `EMP10${i}`,
        firstName: `Inspector${i}`,
        lastName: `Test${i}`,
        role: UserRole.INSPECTOR,
        password: inspectorPassword,
      });
    }
    console.log('✅ Users seeded');
  } else {
    console.log('Users already exist, skipping...');
  }

  const existingLocations = await locationsService.findAll();
  if (existingLocations.length === 0) {
    for (let i = 1; i <= 10; i++) {
      await locationsService.create({
        code: `LOC${i}`,
        name: `Location ${i}`,
      });
    }
    console.log('✅ Locations seeded');
  } else {
    console.log('Locations already exist, skipping...');
  }

  console.log('✅ Database seeding complete');
}
