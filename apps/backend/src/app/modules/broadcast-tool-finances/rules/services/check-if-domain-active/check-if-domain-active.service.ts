import { Injectable } from "@nestjs/common";
import { CheckIfDomainActivePayload } from "./check-if-domain-active.payload";

@Injectable()
export class CheckIfDomainActiveService {
  public async execute(payload: CheckIfDomainActivePayload): Promise<boolean> {
    const { domainRules, broadcast, sendingDate, domain, domainsData } =
      payload;

    const domainData = domainsData.find(
      (domainName) =>
        this.normalizeDomain(domain) ===
          this.normalizeDomain(domainName.domainName) ||
        domainName.domainName.trim().endsWith(`_${domain}`)
    );

    if (!domainData) {
      return false;
    }

    if (domainRules.allowedMondayStatuses.includes(domainData.domainStatus)) {
      return true;
    }

    return false;
  }

  private normalizeDomain(domain: string): string {
    return domain.trim().toLowerCase();
  }
}
