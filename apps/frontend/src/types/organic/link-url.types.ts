export interface LinkUrl {
  linkStart: string;
  trackingType: string;
  linkEnd: string;
  productCode: 'PRODUCT#IMAGE' | 'IMG0000_#IMAGE' | '0000_#IMAGE' | '000_#IMAGE' | 'TRACKINGID_#IMAGE';
}