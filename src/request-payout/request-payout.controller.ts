import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RequestPayoutService } from './request-payout.service';
import { CreateRequestPayoutDto } from './dto/create-request-payout.dto';
import { UpdateRequestPayoutDto } from './dto/update-request-payout.dto';
import { ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/guards/api-guard.guard';

@ApiTags('Request Payout')
@Controller({ path: 'request-payout', version: '1' })
export class RequestPayoutController {
  constructor(private readonly requestPayoutService: RequestPayoutService) {}

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Post()
  create(@Body() createRequestPayoutDto: CreateRequestPayoutDto) {
    return this.requestPayoutService.create(createRequestPayoutDto);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Get()
  findAll() {
    return this.requestPayoutService.findAll();
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @ApiParam({ name: 'id', type: String, required: true })
  @Get(':id')
  async findAllById(@Param() id: string) {
    return this.requestPayoutService.findAllById(id);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @ApiParam({ name: 'id', type: String, required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestPayoutService.findOne(id);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequestPayoutDto: UpdateRequestPayoutDto,
  ) {
    return this.requestPayoutService.update(+id, updateRequestPayoutDto);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestPayoutService.remove(+id);
  }
}
