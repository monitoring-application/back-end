import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateContactUsDto } from 'src/contact-us/dto/create-contact-us.dto';
import { CreateSignUpDto } from 'src/sign-up/dto/create-sign-up.dto';
import { SignUp } from 'src/sign-up/entities/sign-up.entity';

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

  async signUpEmail(data: SignUp) {
    // var url = 'http://localhost:4200/';
    var url = 'https://signup.friendsofroselin.com/';
    const config = new ConfigService();
    var contents = `<div
                      style="
                        background-color: #ffffff;
                        border: 1px solid #e0e4e6;
                        padding: 40px;
                        padding-bottom: 52px;
                        padding-top: 41px;
                        border-radius: 10px;
                        margin-right: 25%;
                        margin-left: 25%;
                      ">`;
    contents =
      contents +
      `<div>
        <p style="font-size: 16px"><b>Hi, ${data.full_name}</b></p>
        <div style="padding-left: 20px;">
          <p>You can refer now a friend with this link: ${url}signup/${data.member_code}</p>
          <p>Username:${data.email}</p>
          <p>Password:${data.member_code}</p>
          <div style="padding-top: 16px">
            <a href="${url}member-login/"
              style="
                background-color: #199319;
                color: white;
                padding: 15px 25px;
                text-decoration: none;
                border-radius: 10px;
              "
              >Login to your account</a
            >
          </div>
        </div>
      </div>`;

    await this.mailerService.sendMail({
      to: data.email,
      from: config.get<string>('MAIL_FROM'),
      subject: 'Verify your email',
      text: 'text1',
      html: contents + '.',
      template: 'forwardmail',
      // context: {
      //   full_name: `${dto.last_name}, ${dto.first_name}`,
      //   email: dto.email,
      //   message: dto.message,
      // },
    });
  }
}
