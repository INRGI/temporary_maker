export interface Strategy {
  copiesPerDay: number;
  copiesTypes: Array<'click' | 'conversion' | 'test' | 'warmup'>;
}
