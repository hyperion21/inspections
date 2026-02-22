import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(employeeId: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmployeeId(employeeId);
    if (!user) throw new UnauthorizedException('User Not Found');

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Incorrect Password');

    return user;
  }

  login(user: User) {
    const payload = {
      employeeId: user.employeeId,
      role: user.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
