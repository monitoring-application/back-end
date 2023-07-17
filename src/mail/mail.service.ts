import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateContactUsDto } from 'src/contact-us/dto/create-contact-us.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendingEmail(dto: CreateContactUsDto) {
    const config = new ConfigService();
    // Forward to responsive email
    var contents = `<p><b>${dto.last_name + ', ' + dto.first_name}</b></p>`;
    contents = contents + `<p><i>${dto.email}</i></p>`;
    contents = contents + `<p></p>`;
    contents = contents + `<p>${dto.message}</p>`;
    await this.mailerService.sendMail({
      to: 'friendsofroselin@gmail.com',
      from: config.get<string>('MAIL_FROM'),
      subject: 'Feedback',
      text: 'text1',
      html: contents + '.',
      template: 'forwardmail',
      context: {
        full_name: `${dto.last_name}, ${dto.first_name}`,
        email: dto.email,
        message: dto.message,
      },
    });
  }
}
