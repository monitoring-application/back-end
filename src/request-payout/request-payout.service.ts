import { Injectable } from '@nestjs/common';
import { CreateRequestPayoutDto } from './dto/create-request-payout.dto';
import { UpdateRequestPayoutDto } from './dto/update-request-payout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestPayout } from './entities/request-payout.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class RequestPayoutService {
  constructor(
    @InjectRepository(RequestPayout)
    private repo: Repository<RequestPayout>,
  ) {}
  async create(dto: CreateRequestPayoutDto) {
    delete dto.id;
    const model = this.repo.create(dto);

    const data = this.repo.save(model);

    return data;
  }

  findAll() {
    return this.repo.find();
  }

  async findAllById(data: { id: string }) {
    const result = await this.repo.find({
      where: {
        member_id: data.id,
      },
      order: { created_at: 'ASC' },
    });
    return result;
  }

  findOne(id: string) {
    return this.repo.findBy({ id });
  }

  update(id: number, updateRequestPayoutDto: UpdateRequestPayoutDto) {
    return `This action updates a #${id} requestPayout`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestPayout`;
  }
}