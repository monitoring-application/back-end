import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { CreateSignUpDto } from './dto/create-sign-up.dto';
import { UpdateSignUpDto } from './dto/update-sign-up.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/guards/api-guard.guard';

@ApiTags('Sign Up')
@Controller({ path: 'sign-up', version: '1' })
export class SignUpController {
  constructor(private readonly signUpService: SignUpService) {}

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Post()
  create(@Body() createSignUpDto: CreateSignUpDto) {
    return this.signUpService.create(createSignUpDto);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Get('pagination')
  findAll(
    @Query()
    queries: {
      search_value: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    return this.signUpService.findAll(queries);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.signUpService.findOne(id);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Get('member/:memberCode')
  findMember(@Param('memberCode') memberCode: string) {
    return this.signUpService.findByMemberCode(memberCode);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSignUpDto: UpdateSignUpDto) {
    return this.signUpService.update(+id, updateSignUpDto);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Patch('approve/:id/:status')
  approve(@Param('id') id: string, @Param('status') status: number) {
    return this.signUpService.approve(id, status);
  }

  @ApiSecurity('access-key')
  @UseGuards(ApiAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.signUpService.remove(id);
  }
}
