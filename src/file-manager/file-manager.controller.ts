import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { CreateFileManagerDto } from './dto/create-file-manager.dto';
import { UpdateFileManagerDto } from './dto/update-file-manager.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
// import toStream from 'buffer-to-stream';
import toStream = require('buffer-to-stream');
import { Request } from 'express';
import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryResponse } from 'src/providers/cloudinary.response';

@ApiTags('File Manager')
@Controller({ path: 'file-manager', version: '1' })
export class FileManagerController {
  constructor(
    private readonly fileManagerService: FileManagerService,
    private config: ConfigService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const body = request.body as CreateFileManagerDto;
    const data = new Promise<CloudinaryResponse>((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: `attachments/` },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // toStream(file.buffer).pipe(upload);
    });
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
