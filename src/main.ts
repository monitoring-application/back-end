import { BadRequestException, flatten, HttpException, HttpStatus, ValidationError, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/exception.filter';


async function bootstrap() {

  const app = await (await NestFactory.create(AppModule, { cors: true }))
    .useGlobalPipes(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const str = JSON.stringify(errors[0].constraints)?.split("\"")
        return new BadRequestException(str.length > 0 ? (str[3] ?? 'Invalid Input') : 'Invalid Input')
      }
    }))

  app.enableCors({
    credentials: true,
    origin: '*'
  })

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v'
  });

  app.useGlobalFilters(new GlobalExceptionFilter())

  const Docconfig = new DocumentBuilder()
    .setTitle('Roselin')
    .setDescription('Roselin API')
    .addBearerAuth(
      { in: 'header', type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addApiKey({
      type: 'apiKey', // this should be apiKey
      name: 'api-key', // this is the name of the key you expect in header
      in: 'header',
    }, 'access-key')
    .build();

  const document = SwaggerModule.createDocument(app, Docconfig);
  SwaggerModule.setup('docs', app, document);
  // const config = new ConfigService()
  await app.listen(3000, () => {
    console.log('Roselin-contact us App Started' + 3000)
  });
}
bootstrap();
