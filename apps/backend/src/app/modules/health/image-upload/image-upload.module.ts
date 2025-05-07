import { Module } from '@nestjs/common';
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from './image-upload.providers';

@Module({
  imports: [],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class ImageUploadModule {}
