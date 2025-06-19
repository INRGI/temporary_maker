import {
  CopyAssignmentStrategyRules,
  Strategy,
} from '@epc-services/interface-adapters';

export function getCopyStrategyForDay(
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules,
  copiesPerDay: number
): Strategy | null {
  const strategy = copyAssignmentStrategyRules.strategies.find(
    (s) => s.copiesPerDay === copiesPerDay
  );
  return strategy ?? null;
}
