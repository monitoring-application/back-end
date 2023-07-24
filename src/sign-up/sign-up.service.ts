import { Injectable } from '@nestjs/common';
import { CreateSignUpDto } from './dto/create-sign-up.dto';
import { UpdateSignUpDto } from './dto/update-sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionNotFoundError, IsNull, Like, Repository } from 'typeorm';
import { SignUp } from './entities/sign-up.entity';
import { compareSync } from 'bcrypt';
import { promises } from 'dns';
import { Sign } from 'crypto';

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(SignUp)
    private signUpRepo: Repository<SignUp>,
  ) {}

  create(createSignUpDto: CreateSignUpDto) {
    delete createSignUpDto.id;
    const model = this.signUpRepo.create(createSignUpDto);

    model.member_code = this.generateRandomValue();
    model.full_name = `${createSignUpDto.first_name} ${createSignUpDto.last_name}`;

    const data = this.signUpRepo.save(model);
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

  findByMemberCode(memberCode: string) {
    return this.signUpRepo.findBy({ member_code: memberCode });
  }

  update(id: number, updateSignUpDto: UpdateSignUpDto) {
    return `This action updates a #${id} signUp`;
  }

  async approve(id: string, status: number): Promise<any> {
    const model = await this.signUpRepo.findOneBy({ id });
    model.status = status;

    var retVal = this.signUpRepo.update(model.id, model);
    if (model.referal_code == null || model.referal_code == '') {
    } else {
      const updateMain = await this.signUpRepo.findOneBy({
        member_code: model.referal_code,
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
      referal_code: item.member_code,
      status: 1,
    });
    item.downline = count;

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
}
