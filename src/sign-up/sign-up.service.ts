import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSignUpDto } from './dto/create-sign-up.dto';
import { UpdateSignUpDto } from './dto/update-sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { SignUp } from './entities/sign-up.entity';
import * as bcrypt from 'bcryptjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from 'src/mail/mail.service';
import { match } from 'assert';

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(SignUp)
    private signUpRepo: Repository<SignUp>,
    private emailevent: EventEmitter2,
    private mailService: MailService,
  ) {}

  async create(dto: CreateSignUpDto) {
    const isExist = await this.findByEmail(dto.email);
    if (isExist) return true;

    delete dto.id;
    const pass = this.generateRandomValue();
    const model = this.signUpRepo.create(dto);
    model.member_code = this.generateRandomValue();
    model.password = pass;
    model.passwordHash = await this.hashData(pass);

    const data = this.signUpRepo.save(model);

    this.emailevent.emit('email.sent', model);
    this.mailService.signUpEmail(await data);

    this.updateUpline(dto.upline);

    return false;
  }

  async findAll(filter: {
    id: string;
    search_value: string;
    pageNumber: number;
    pageSize: number;
  }) {
    const pageNumber = filter.pageNumber;
    const pageSize = filter.pageSize;

    const [result, count] = await this.signUpRepo.findAndCount({
      where: {
        upline: filter.id == '' ? Like(`%${filter.id}%`) : filter.id,
        full_name: Like(`%${filter.search_value}%`),
      },

      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
    this.signUpRepo.findAndCount();
    return {
      result,
      count,
      pageNumber,
      pageSize,
    };
  }

  findOne(id: string) {
    return this.signUpRepo.findBy({ id });
  }

  update(id: number, updateSignUpDto: UpdateSignUpDto) {
    return `This action updates a #${id} signUp`;
  }

  async approve(id: string, status: number): Promise<any> {
    const model = await this.signUpRepo.findOneBy({ id });
    model.status = status;

    var retVal = this.signUpRepo.update(model.id, model);
    if (model.upline == null || model.upline == '') {
    } else {
      const updateMain = await this.signUpRepo.findOneBy({
        member_code: model.upline,
      });

      this.updateCountDownline(updateMain);
    }

    return retVal;
  }

  async remove(id: string) {
    const model = await this.findOne(id);
    await this.signUpRepo.softRemove(model);
    return {
      message: 'Email Deleted',
    };
  }

  async updateCountDownline(item: SignUp) {
    const count = await this.signUpRepo.countBy({
      upline: item.id,
      status: 1,
    });
    item.ttlDownline = count;

    await this.signUpRepo.update(item.id, item);
  }

  generateRandomValue() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var randomValue = '';
    for (var i = 0; i < 9; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      randomValue += characters.charAt(randomIndex);
    }

    return randomValue;
  }
  async hashData(data: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data, saltOrRounds);
    return hash;
  }

  async login(loginCreds: any) {
    const { username, password } = loginCreds;
    let userStats = 0;
    let retVal = {
      id: '',
      member_code: '',
      full_name: '',
      email: '',
      // password: '',
      mobile_number: '',
      upline: '',
      ttlDownline: 0,
      status: 0,
      userStats: 0,
    };

    const user = await this.findByEmail(username);

    if (!user) userStats = 1;
    if (user.status != 1 && user.status != 4) userStats = 2;

    const matched = await bcrypt
      .compare(password, user.passwordHash)
      .then(function (result: any) {
        return result;
      });
    if (!matched) userStats = 3;

    retVal = {
      id: user.id,
      member_code: user.member_code,
      full_name: user.full_name,
      email: user.email,
      mobile_number: user.mobile_number,
      upline: user.upline,
      ttlDownline: user.ttlDownline,
      status: user.status,
      userStats: userStats,
    };
    return retVal;
  }

  async findByEmail(username: string) {
    return await this.signUpRepo.findOneBy({ email: username });
  }

  async updateUpline(id: string) {
    const upline = await this.signUpRepo.findOneBy({ id: id });

    if (!upline) return;

    upline.ttlDownline = await this.countDownline(id);

    this.signUpRepo.update(upline.id, upline);
  }

  async countDownline(id: string) {
    if (id.trim().length === 0) return 0;

    return await this.signUpRepo.count({
      where: {
        upline: id,
      },
    });
  }
}
