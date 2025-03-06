import { Module } from '@nestjs/common';
import { applicationProviders, serviceProviders } from './copy-parser.providers';

@Module({
  imports: [],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class CopyParserModule {}
