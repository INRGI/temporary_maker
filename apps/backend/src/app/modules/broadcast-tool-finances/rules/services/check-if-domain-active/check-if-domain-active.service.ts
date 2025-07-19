import { Injectable } from "@nestjs/common";
import { CheckIfDomainActivePayload } from "./check-if-domain-active.payload";

@Injectable()
export class CheckIfDomainActiveService {
  public async execute(payload: CheckIfDomainActivePayload): Promise<boolean> {
    const { domainRules, domainsData, domain } = payload;

    const normalized = this.normalizeDomain(domain);

    const domainData = domainsData.find(({ domainName }) => {
      const normalizedName = this.normalizeDomain(domainName);
      return (
        normalizedName === normalized ||
        normalizedName.endsWith(`_${normalized}`) ||
        normalizedName.endsWith(`-${normalized}`)
      );
    });

    return domainData
      ? domainRules.allowedMondayStatuses.includes(domainData.domainStatus)
      : false;
  }

  private normalizeDomain(domain: string): string {
    return domain.trim().toLowerCase();
  }
}
