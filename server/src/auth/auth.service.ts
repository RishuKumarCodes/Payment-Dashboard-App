import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // For demo purposes, use hardcoded admin user
    if (username === 'admin' && password === 'admin123') {
      const payload = { username: 'admin', sub: '1', role: 'admin' };
      return {
        access_token: this.jwtService.sign(payload),
        user: { username: 'admin', role: 'admin' },
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUser(payload: any): Promise<any> {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
