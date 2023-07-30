import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { AdminUser } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apikey } from './entities/api-keys.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(AdminUser)
    private readonly userRepo: Repository<AdminUser>,
    @InjectRepository(Apikey) private readonly apiRepo: Repository<Apikey>,
    // private roleService: RoleService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    if (!user.active)
      throw new HttpException('Invalid User', HttpStatus.BAD_REQUEST);
    if (user.logged_in == true)
      throw new HttpException(
        'User is already logged-in, logout first from another pc or browser.',
        HttpStatus.BAD_REQUEST,
      );
    if (!user.password)
      throw new HttpException(
        'User credential not found.',
        HttpStatus.BAD_REQUEST,
      );
    var isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  verify(data: { id: number }) {
    return this.userService.Verify(data.id);
  }

  async login(loginCreds: any): Promise<any> {
    const { username, password } = loginCreds;
    let userStats = 0;
    let retVal = {
      id: 0,
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      active: true,
      userStats: 0,
    };

    const user = await this.findByEmail(username);

    if (!user) userStats = 1;
    if (user.active == false) userStats = 2;

    const matched = await bcrypt
      .compare(password, user.password)
      .then(function (result: any) {
        return result;
      });
    if (!matched) userStats = 3;

    retVal = {
      id: user.id,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      email: user.email,
      active: user.active,
      userStats: userStats,
    };

    return retVal;
  }
  findByEmail(username: string) {
    return this.userRepo.findOne({
      where: {
        email: username,
      },
    });
  }
  private apiKeys: string[] = ['6885ab74-d692-4ad2-a6dc-8690ff3e7a24'];

  async validateApiKey(apiKey: string) {
    const keys = await this.apiRepo.find({
      where: {
        name: 'roselin',
        key: apiKey,
        active: true,
      },
    });
    return keys.find((x) => x.key === apiKey);
    // return this.apiKeys;
  }

  // async logout(userId: string) {
  //     return this.userService.Update(userId, { refreshToken: null });
  // }
}
