import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/guards/api-guard.guard';
import { ManualEventEmitterService } from 'src/common/manual.event.emitter.service';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';

@ApiTags('Contact Us')
@Controller({ path: 'contact-us', version: '1' })
export class ContactUsController {
  constructor(
    private readonly service: ContactUsService,
    private emitter: ManualEventEmitterService,
    private eventEmiiter: EventEmitter2,
  ) {}

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Post()
  async create(@Body() createContactUsDto: CreateContactUsDto) {
    return this.service.create(createContactUsDto);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
