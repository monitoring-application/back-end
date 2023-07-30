import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { createUserDto } from './dto/create-user.dto';
import { AdminUser } from './entities/user.entity';
import { AdminToken } from './entities/personal_tokens';
import { updateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly userRepo: Repository<AdminUser>,
    @InjectRepository(AdminToken)
    private readonly rtRepo: Repository<AdminToken>,
  ) {}

  // async create(user: signupUserDto) {
  //   const password = user.password;
  //   const hash = await this.hashData(password)
  //   var nuser = new User()
  //   nuser.mobile = user.mobile
  //   nuser.email = user.email
  //   nuser.userType = user.userType
  //   nuser.avatar = user.avatarUrl
  //   nuser.password = hash
  //   var data = await this.userRepo.save(nuser);
  //   delete data.password;
  //   return data
  // }

  composeName(user: createUserDto) {
    const fname = !user?.first_name?.trim() ? '' : user.first_name?.trim();
    const mname = !user?.middle_name?.trim()
      ? ''
      : user.middle_name?.trim().substring(0, 1) + '.';
    const lname = !user?.last_name?.trim() ? '' : user.last_name?.trim();
    const name_ext = !user?.name_ext?.trim() ? '' : user.name_ext?.trim();
    return `${fname} ${mname} ${lname} ${name_ext}`;
  }

  async signup(user: createUserDto) {
    // check if mobile is already registered
    if (!user.role_id) delete user['role_id'];
    if (user.role_id == 0) delete user['role_id'];
    if (!user.name) user.name = this.composeName(user);
    const exists = await this.userRepo.findOne({
      where: { email: user.email },
    });
    if (exists)
      throw new HttpException(
        'email is already registered',
        HttpStatus.CONFLICT,
      );

    const model = this.userRepo.create(user);
    const hash = await this.hashData(user.password);
    model.password = hash;
    var data = await this.userRepo.save(model);
    return this.findOneModel(data.id);
  }

  async updateBasicInfo(user: UpdateUserDto) {
    const model = this.userRepo.create(user);
    return this.userRepo.save(model);
  }

  async findByEmail(email: string) {
    var data = await this.userRepo.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'active',
        'logged_in',
        'default',
        'first_name',
        'last_name',
        'middle_name',
        'contact',
        'name',
        'name_ext',
        'position',
        'verified',
      ],
    });
    return data;
  }

  async findAll() {
    var model = await this.userRepo.find({
      where: {
        hidden: false,
      },
    });
    return model;
  }

  async findOneModel(id: number) {
    var data = await this.userRepo.findOne({
      where: { id: id },
    });
    return data;
    // var data = this.userRepo.createQueryBuilder('user')
    //   .leftJoinAndSelect(RoleRouteForm, 'frm', 'user.roleId=frm.role_id')
    //   .getRawOne()
    // return data
  }

  async logout(userId: number) {
    return this.updateUserLogin(userId, false);
  }

  async updateUserLogin(userId: number, loggedIn: boolean) {
    const user = await this.findOneModel(userId);
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    user.logged_in = loggedIn;
    await this.userRepo.save(user);
    return {
      message: 'success',
    };
  }

  async UpdateRole(id: number, role_id: number) {
    let user = await this.userRepo.findOneBy({ id: id });
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    await this.userRepo.save(user);
    return this.findOneModel(id);
  }

  async UpdateStatus(data: updateUserStatusDto) {
    const user = await this.userRepo.findOneBy({ id: data.id });
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    user.active = data.active;
    await this.userRepo.save(user);
    return user;
  }

  async UpdateUserDefault(data: { id: number; default: boolean }) {
    const user = await this.userRepo.findOneBy({ id: data.id });
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    user.default = data.default;
    await this.userRepo.save(user);
    return user;
  }

  async Update(id: number, user: UpdateUserDto) {
    if (!user.role_id) delete user['role_id'];
    if (user.role_id == 0) delete user['role_id'];

    // const role = await this.roleService.findOne(role_id)
    // if (!role) throw new HttpException('role not found', HttpStatus.BAD_REQUEST)

    const model = this.userRepo.create(user);
    model.password = await this.hashData(user.password);
    // await this.userRepo.createQueryBuilder('user')
    //   .update(AdminUser)
    //   .set(model)
    //   .where('id=:id', { id: id })
    //   .execute()
    await this.userRepo.update(id, model);
    return this.findOneModel(id);
  }

  // UpdateModel(id: number, data: UpdateUserDto) {
  //   return this.userService.UpdateStatus(data)
  // }

  async Verify(id: number) {
    var model = await this.userRepo.findOneBy({ id: id });
    if (!model)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    model.verified = true;
    await this.userRepo.update(id, model);
    return this.findOneModel(id);
  }

  // async findOneById(id: string): Promise<User | undefined> {
  //   return this.userRepo.findOneByOrFail({ id: id });
  // }

  async Remove(id: number) {
    return this.userRepo.delete([id]);
  }

  async hashData(data: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data, saltOrRounds);
    return hash;
  }
}
