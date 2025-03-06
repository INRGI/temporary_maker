import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BroadcastModule } from './modules/broadcast/broadcast.module';
import { PriorityProductsModule } from './modules/priority-products/priority-products.module';
import { CopyModule } from './modules/copy/copy.module';

@Module({
  imports: [    
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'frontend'),
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BroadcastModule,
    PriorityProductsModule,
    CopyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
