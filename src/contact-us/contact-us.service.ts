import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { ContactUs } from './entities/contact-us.entity';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs) private repo: Repository<ContactUs>,
    private emailevent: EventEmitter2,
    private forwardMail: MailService
  ) {
  }

  async create(dto: CreateContactUsDto) {
    const model = this.repo.create(dto)
    await this.repo.save(model)
    this.emailevent.emit('email.sent', model)
    this.forwardMail.sendingEmail(dto)
    return {
      message: 'Email Sent'
    }
  }

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return this.repo.findBy({ id })
  }

  async remove(id: number) {
    const model = await this.findOne(id)
    await this.repo.softRemove(model)
    return {
      message: 'Email Deleted'
    }
  }

}
