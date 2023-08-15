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
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { CreateFileManagerDto } from './dto/create-file-manager.dto';
import { UpdateFileManagerDto } from './dto/update-file-manager.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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
      toStream(file.buffer).pipe(upload);
    });

    data
      .then(async (s: any) => {
        const param = {
          member_id: body.member_id,
          folder: s.folder,
          orig_name: file.originalname,
          file_name: s.public_id,
          path: s.secure_url,
          avatar: body.avatar,
          page_name: body.page_name,
          social_media: body.social_media,
        } as CreateFileManagerDto;

        return await this.fileManagerService.create(param);
      })
      .catch((ex) => {
        throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
      });
    return {
      message: 'success',
    };
  }

  @Get('per-member/:id')
  findAll(@Param('id') id: string) {
    return this.fileManagerService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileManagerService.findOne(+id);
  }

  @Patch('approve/:id/:status')
  update(@Param('id') id: number, @Param('status') status: number) {
    return this.fileManagerService.update(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.fileManagerService.remove(id);
  }
}
