import { UserService } from './user.service';
import { ApiBody, ApiExcludeController, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { createUserDto } from './dto/create-user.dto';
import { UpdateRoleDto, updateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@ApiExcludeController(true)
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService,
    private authService: AuthService) { }

  @ApiBody({
    type: createUserDto
  })
  @Post('sign-up')
  // @ApiSecurity('access-key')
  // @UseGuards(ApiGuardGuard)
  Register(@Body() user: createUserDto) {
    return this.userService.signup(user)
  }

  // @Post('update-info')
  // // @ApiSecurity('access-key')
  // // @UseGuards(ApiGuardGuard)
  // updateBasicInfo(@Body() user: CreateUserDto) {
  //   return this.userService.updateBasicInfo(user)
  // }

  // @Post('forgot-password')
  // ForgotPassword() {
  //   // check account and email reset password
  // }
  // @Post('reset-password')
  // ResetPassword() {
  //   // check account and email reset password
  // }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true
  })
  @Post('verify-user/:id')
  async VerifyUser(@Param() data: { id: number }) {
    return this.authService.verify(data)
  }

  @Post('login')
  // @ApiSecurity('access-key')
  // @UseGuards(ApiGuardGuard) 
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Post('logout/:id')
  async Logout(@Param('id') userId: number) {
    console.log(userId + '')
    return this.userService.logout(userId)
  }

  @ApiParam({ name: 'role_id', type: Number, required: true })
  @ApiParam({ name: 'id', type: Number, required: true })
  @Patch('update/user/role/:id/:role_id')
  UpdateRole(@Param() data: UpdateRoleDto) {
    return this.userService.UpdateRole(+data.id, +data.role_id)
  }

  @ApiParam({
    name: 'default',
    type: Boolean,
    required: true,
    example: 'false'
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @Patch('update/user/default/:id/:default')
  UpdateUserDefault(@Param() data: { id: number, default: boolean }) {
    return this.userService.UpdateUserDefault(data)
  }


  @Patch('user-status')
  UpdateStatus(@Body() data: updateUserStatusDto) {
    return this.userService.UpdateStatus(data)
  }

  @Patch(':id')
  Update(@Body() data: UpdateUserDto, @Param('id') id: number,) {
    return this.userService.Update(id, data)
  }


  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOneModel(id)
  }

  // @Post('verify/:id')
  // // @UseGuards(JWTAuthGuard)
  // // @ApiBearerAuth('access-token')
  // // @ApiSecurity('access-key')
  // // @UseGuards(ApiGuardGuard)
  // Verify(@Param('id') id: number) {
  //   return this.userService.Verify(id);
  // }

  // @Post('update-status')
  // // @UseGuards(ApiGuardGuard)
  // // @ApiSecurity('access-key')
  // async UpdateStatus(@Body() pl: any) {
  //   var data = await this.userService.UpdateStatus(pl.id, pl.status);
  //   return data;
  // }

  // @Get()
  // // @UseGuards(ApiGuardGuard)
  // // @ApiSecurity('access-key')
  // // @ApiSecurity('access-key')
  // FindAll() {
  //   return this.userService.findAll();
  // }

  // @Patch('update/:id')
  // // @UseGuards(ApiGuardGuard)
  // // @ApiSecurity('access-key')
  // Update(@Param('id') id: string, @Body() user: UpdateUserDto) {
  //   return this.userService.Update(id, user);
  // }

  // @UseGuards(JWTAuthGuard)
  // @Get(':id')
  // FindOne(@Param('id') id: string) {
  //   return this.userService.findOneById(id);
  // }

  // @Delete(':id')
  // // @UseGuards(ApiGuardGuard)
  // // @ApiSecurity('access-key')
  // Delete(@Param('id') id: number) {
  //   return this.userService.Remove(id);
  // }

}
