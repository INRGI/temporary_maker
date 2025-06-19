import { Provider } from '@nestjs/common';
import { GetProductDataService } from './services/get-product-data/get-product-data.service';
import { MondayController } from './controllers/monday.message.controller';
import { GetDomainDataService } from './services/get-domain-data/get-domain-data.service';
import { GetAllDomainsDataService } from './services/get-all-domains-data/get-all-domains-data.service';
import { GetAllProductsDataService } from './services/get-all-products-data/get-all-products-data.service';
import { GetProductStatusesService } from './services/get-product-statuses/get-product-statuses.service';
import { GetDomainStatusesService } from './services/get-domain-statuses/get-domain-statuses.service';
import { MondayConfigService } from '@epc-services/core';

export const messageControllers = [MondayController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  GetProductDataService,
  GetDomainDataService,
  GetAllDomainsDataService,
  GetAllProductsDataService,
  GetProductStatusesService,
  GetDomainStatusesService,
  MondayConfigService,
];
