import { Provider } from "@nestjs/common";
import { VerifyCopyForDomainService } from "./services/verify-copy-for-domain/verify-copy-for-domain.service";
import { VerifyWarmupCopyForDomainService } from "./services/verify-warmup-copy-for-domain/verify-warmup-copy-for-domain.service";

export const messageControllers = [];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  VerifyCopyForDomainService,
  VerifyWarmupCopyForDomainService,
];
