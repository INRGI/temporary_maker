import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./monday.providers";
import { MondayApiModule } from "@epc-services/monday-api";
import { MondayConfigModule } from "@epc-services/core";
import { MondayApiOptionsFactoryService } from "../../../infrastructure/options-factory/monday-api.options-factory.service";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
    MondayApiModule.registerAsync({
      imports: [MondayConfigModule],
      useClass: MondayApiOptionsFactoryService,
    }),
    CacheModule.register({
      ttl: 900,
      isGlobal: true,
      prefix: "monday:",
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [...applicationProviders, ...serviceProviders],
})
export class MondayModule {}
