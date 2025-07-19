import { Injectable } from "@nestjs/common";
import { CheckIfDomainWarmupPayload } from "./check-if-domain-warmup.payload";

@Injectable()
export class CheckIfDomainWarmupService {
  public async execute(payload: CheckIfDomainWarmupPayload): Promise<boolean> {
    const { domain, domainsData } = payload;
    const normalized = this.normalizeDomain(domain);

    const domainData = domainsData.find(({ domainName }) => {
      const normalizedName = this.normalizeDomain(domainName);
      return (
        normalizedName === normalized ||
        normalizedName.endsWith(`_${normalized}`) ||
        normalizedName.endsWith(`-${normalized}`)
      );
    });

    return domainData?.domainStatus === "Warm Up";
  }

  private normalizeDomain(domain: string): string {
    return domain.trim().toLowerCase();
  }
}
