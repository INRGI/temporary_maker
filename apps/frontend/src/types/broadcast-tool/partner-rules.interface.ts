export interface PartnerRules {
  useNewPartnerForClickableCopies: boolean;
  allowedIspsForNewPartners: string[];
  daysSendingForNewPartners: number;
  blacklistedPartners: string[];
  similarPartnerDomainLimit: number;
}
