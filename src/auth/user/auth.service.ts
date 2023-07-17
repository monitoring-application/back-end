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
    @InjectRepository(Apikey) private readonly apiRepo: Repository<Apikey>,
    // private roleService: RoleService,
    private config: ConfigService,
  ) {}

  async getToken(id: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          id,
          email: email,
        },
        {
          expiresIn: '7d',
          secret: this.config.get('JWT_SECRET'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          id,
          email: email,
        },
        {
          expiresIn: '7d',
          secret: this.config.get('JWT_REFRESH_SECRET'),
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

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

  async login(user: AdminUser): Promise<any> {
    // const payload = { email: user.email, sub: user.id };
    const tokens = await this.getToken(user.id, user.email);
    // await this.userService.saveRefreshToken(user.id, tokens.refresh_token)
    // token.this.jwtService.sign(payload)
    // const role = await this.roleService.findOne(user.role_id)
    await this.userService.updateUserLogin(user.id, true);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      first_name: user.first_name,
      last_name: user.last_name,
      middle_name: user.middle_name,
      name_ext: user.name_ext,
      contact: user.contact,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
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
