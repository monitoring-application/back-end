import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { CreateFileManagerDto } from './dto/create-file-manager.dto';
import { UpdateFileManagerDto } from './dto/update-file-manager.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('File Manager')
@Controller({ path: 'file-manager', version: '1' })
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Post()
  create(@Body() createFileManagerDto: CreateFileManagerDto) {
    return this.fileManagerService.create(createFileManagerDto);
  }

  @Get()
  findAll() {
    return this.fileManagerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileManagerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFileManagerDto: UpdateFileManagerDto,
  ) {
    return this.fileManagerService.update(+id, updateFileManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileManagerService.remove(+id);
  }
}
