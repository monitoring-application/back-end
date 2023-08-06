import { Global, Module } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';
import { CloudinaryProvider } from 'src/providers/cloudinary.providers';
import { FileManager } from './entities/file-manager.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileManager])],
  controllers: [FileManagerController],
  providers: [CloudinaryProvider, FileManagerService],
  exports: [CloudinaryProvider, FileManagerService],
})
export class FileManagerModule {}
