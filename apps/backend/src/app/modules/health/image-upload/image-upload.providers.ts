import { Provider } from '@nestjs/common';
import { UploadImageToWordpressService } from './services/upload-image-to-wordpress/upload-image-to-wordpress.service';
import { ImageUploadMessageController } from './controllers/image-upload.message.controller';

export const messageControllers = [ImageUploadMessageController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [UploadImageToWordpressService];
