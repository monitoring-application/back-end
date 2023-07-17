import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/user/auth.module';
import { UserModule } from './auth/user/user.module';
import { TransformInterceptor } from './interceptors/response-interceptor';
import { TypeOrmConfigAsync } from 'configuration/TypeOrmConfigAsync';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ContactUsModule } from './contact-us/contact-us.module';
import { ManualEventEmitterService } from './common/manual.event.emitter.service';
import { EmailService } from './common/email.service';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SignUpModule } from './sign-up/sign-up.module';
@Global()
@Module({
  imports: [
    UserModule,
    AuthModule,
    ContactUsModule,
    SwaggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfigAsync),
    MailerModule.forRootAsync({
      imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.get('SENDGRID_SERVER'),
          secure: false,
          auth: {
            user: config.get('SENDGRID_USERNAME'),
            pass: config.get('SENDGRID_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '..', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    MailModule,
    SignUpModule,
  ],
  controllers: [],
  providers: [
    EmailService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    ManualEventEmitterService,
  ],
  exports: [ManualEventEmitterService],
})
export class AppModule {}
