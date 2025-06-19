import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FinancesModule } from './modules/finances/finances.module';
import { HealthModule } from './modules/health/health.module';
import { BroadcastToolFinancesModule } from './modules/broadcast-tool-finances/broadcast-tool-finances.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FinancesModule,
    HealthModule,
    BroadcastToolFinancesModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL')
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
