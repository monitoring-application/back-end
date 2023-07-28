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

  async findAll(filter: {
    search_value: string;
    pageNumber: number;
    pageSize: number;
  }) {
    const pageNumber = filter.pageNumber;
    const pageSize = filter.pageSize;

    const [result, count] = await this.repo.findAndCount({
      where: { member_name: Like(`%${filter.search_value}%`) },
      order: { status: 'ASC', created_at: 'ASC' },

      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    this.repo.findAndCount();
    return {
      result,
      count,
      pageNumber,
      pageSize,
    };
  }

  async findAllById(data: { id: string }) {
    const result = await this.repo.find({
      where: {
        member_id: data.id,
      },
      order: { status: 'ASC', created_at: 'ASC' },
    });
    return result;
  }

  findOne(id: string) {
    return this.repo.findBy({ id });
  }

  async paid(data: { id: string }) {
    const model = await this.repo.findOneBy({
      id: data.id,
    });

    model.status = 1;
    model.paid_at = new Date();

    var retVal = this.repo.update(model.id, model);

    return retVal;
  }

  update(id: number, updateRequestPayoutDto: UpdateRequestPayoutDto) {
    return `This action updates a #${id} requestPayout`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestPayout`;
  }
}
