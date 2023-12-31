import { Injectable } from '@nestjs/common';
import { CreateFileManagerDto } from './dto/create-file-manager.dto';
import { UpdateFileManagerDto } from './dto/update-file-manager.dto';
import { FileManager } from './entities/file-manager.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import toStream = require('buffer-to-stream');

@Injectable()
export class FileManagerService {
  constructor(
    @InjectRepository(FileManager) private repo: Repository<FileManager>,
  ) {}
  async create(createFileManagerDto: CreateFileManagerDto) {
    const data = this.repo.create(createFileManagerDto);
    return await this.repo.save(data);
  }

  findAll(id: string) {
    return this.repo.find({
      where: {
        member_id: id,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} fileManager`;
  }

  async update(id: number, status: number) {
    const model = await this.repo.findOneBy({ id });
    model.status = status;

    var retVal = this.repo.update(model.id, model);
    return retVal;
  }

  async remove(id: number) {
    const removeResponse = await this.repo.softDelete(id);
    return removeResponse;
  }
}
