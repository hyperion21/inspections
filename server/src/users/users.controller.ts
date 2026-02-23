import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../users/roles.decorator';
import { RolesGuard } from '../users/roles.guard';
import { User, UserRole } from '../users/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile details',
    type: UserDto,
  })
  getProfile(@Request() req: { user: User }): Promise<User> {
    const employeeId = req.user.employeeId;
    return this.usersService.getUserProfile(employeeId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated',
    type: UserDto,
  })
  async updateProfile(
    @Request() req: { user: User },
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const employeeId = req.user.employeeId;
    return this.usersService.update(employeeId, updateProfileDto);
  }

  @Get()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all users (Manager only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserDto],
  })
  getAllUsers(@Query('role') role?: string): Promise<User[]> {
    let roleEnum: UserRole | undefined;

    if (role) {
      if (!Object.values(UserRole).includes(role as UserRole)) {
        throw new BadRequestException(
          `Invalid role: ${role}. Allowed: ${Object.values(UserRole).join(', ')}`,
        );
      }
      roleEnum = role as UserRole;
    }

    return this.usersService.findAll(roleEnum);
  }

  @Get(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Get a user by ID (Manager only)' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: UserDto,
  })
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserProfile(id);
  }

  @Post()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new user (Manager only)' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.usersService.hashPassword(
      createUserDto.password,
    );
    createUserDto.password = hashedPassword;
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Update an existing user (Manager only)' })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: UserDto,
  })
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete a user (Manager only)' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  deleteUser(
    @Request() req: { user: User },
    @Param('id') id: string,
  ): Promise<User> {
    if (req.user.employeeId === id) {
      throw new BadRequestException('Managers cannot delete their own account');
    }
    return this.usersService.remove(id);
  }
}
