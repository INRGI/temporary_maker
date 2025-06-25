import { Injectable } from "@nestjs/common";
import { CheckIfDomainWarmupPayload } from "./check-if-domain-warmup.payload";

@Injectable()
export class CheckIfDomainWarmupService {
  public async execute(payload: CheckIfDomainWarmupPayload): Promise<boolean> {
    const { domain, domainsData } = payload;

    const domainData = domainsData.find(
      (domainName) =>
        this.normalizeDomain(domain) ===
          this.normalizeDomain(domainName.domainName) ||
        domainName.domainName.trim().endsWith(`_${domain}`) ||
        domainName.domainName.trim().endsWith(`-${domain}`)
    );

    if (!domainData) {
      return false;
    }

    if (domainData.domainStatus === "Warm Up") {
      return true;
    }

    return false;
  }

  private normalizeDomain(domain: string): string {
    return domain.trim().toLowerCase();
  }
}
