import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FinancesModule } from './modules/finances/finances.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FinancesModule,
    HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
