import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiExcludeController(true)
export class MailController {
  constructor(private readonly mailService: MailService) {}
}
