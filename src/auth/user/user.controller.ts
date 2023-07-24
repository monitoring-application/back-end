import { UserService } from './user.service';
import {
  ApiBody,
  ApiExcludeController,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { createUserDto } from './dto/create-user.dto';
import {
  UpdateRoleDto,
  updateUserStatusDto,
} from './dto/update-user-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
// @ApiExcludeController(true)
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiBody({
    type: createUserDto,
  })
  @Post('sign-up')
  Register(@Body() user: createUserDto) {
    return this.userService.signup(user);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @Post('verify-user/:id')
  async VerifyUser(@Param() data: { id: number }) {
    return this.authService.verify(data);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout/:id')
  async Logout(@Param('id') userId: number) {
    console.log(userId + '');
    return this.userService.logout(userId);
  }

  @ApiParam({ name: 'role_id', type: Number, required: true })
  @ApiParam({ name: 'id', type: Number, required: true })
  @Patch('update/user/role/:id/:role_id')
  UpdateRole(@Param() data: UpdateRoleDto) {
    return this.userService.UpdateRole(+data.id, +data.role_id);
  }

  @ApiParam({
    name: 'default',
    type: Boolean,
    required: true,
    example: 'false',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @Patch('update/user/default/:id/:default')
  UpdateUserDefault(@Param() data: { id: number; default: boolean }) {
    return this.userService.UpdateUserDefault(data);
  }

  @Patch('user-status')
  UpdateStatus(@Body() data: updateUserStatusDto) {
    return this.userService.UpdateStatus(data);
  }

  @Patch(':id')
  Update(@Body() data: UpdateUserDto, @Param('id') id: number) {
    return this.userService.Update(id, data);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOneModel(id);
  }
}
