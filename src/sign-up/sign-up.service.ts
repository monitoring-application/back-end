import { Injectable } from '@nestjs/common';
import { CreateSignUpDto } from './dto/create-sign-up.dto';
import { UpdateSignUpDto } from './dto/update-sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUp } from './entities/sign-up.entity';

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
    const data = this.signUpRepo.save(model);
    return data;
  }

  findAll() {
    return `This action returns all signUp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} signUp`;
  }

  update(id: number, updateSignUpDto: UpdateSignUpDto) {
    return `This action updates a #${id} signUp`;
  }

  remove(id: number) {
    return `This action removes a #${id} signUp`;
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
