import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSignUpDto } from './dto/create-sign-up.dto';
import { UpdateSignUpDto } from './dto/update-sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { SignUp } from './entities/sign-up.entity';
import * as bcrypt from 'bcryptjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(SignUp)
    private signUpRepo: Repository<SignUp>,
    private emailevent: EventEmitter2,
    private mailService: MailService,
  ) {}

  async create(dto: CreateSignUpDto) {
    delete dto.id;
    var code = this.generateRandomValue();

    const model = this.signUpRepo.create(dto);
    model.member_code = code;
    model.password = await this.hashData(code);

    const data = this.signUpRepo.save(model);

    this.emailevent.emit('email.sent', model);
    this.mailService.signUpEmail(await data);

    return data;
  }

  async findAll(filter: {
    search_value: string;
    pageNumber: number;
    pageSize: number;
  }) {
    const pageNumber = filter.pageNumber;
    const pageSize = filter.pageSize;

    const [result, count] = await this.signUpRepo.findAndCount({
      where: [
        {
          full_name: Like(`%${filter.search_value}%`),
        },
        {
          member_code: Like(`%${filter.search_value}%`),
        },
      ],

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

  async findByMemberCode(memberCode: string) {
    const code = await this.signUpRepo.findOne({
      where: {
        member_code: memberCode,
        status: 1,
      },
    });
    console.log(code);
    if (!code) return new BadRequestException('Code not found or inactive');

    return code;
  }

  update(id: number, updateSignUpDto: UpdateSignUpDto) {
    return `This action updates a #${id} signUp`;
  }

  async approve(id: string, status: number): Promise<any> {
    const model = await this.signUpRepo.findOneBy({ id });
    model.status = status;

    var retVal = this.signUpRepo.update(model.id, model);
    if (model.id == null || model.id == '') {
    } else {
      const updateMain = await this.signUpRepo.findOneBy({
        member_code: model.id,
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

    if (!user) return (userStats = 0);
    if (user.status != 1) return (userStats = 1);

    const matched = await bcrypt
      .compare(password, user.password)
      .then(function (result: any) {
        return result;
      });
    if (!matched) return (userStats = 2);

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

  findByEmail(username: string) {
    return this.signUpRepo.findOne({
      where: {
        email: username,
      },
    });
  }
}
