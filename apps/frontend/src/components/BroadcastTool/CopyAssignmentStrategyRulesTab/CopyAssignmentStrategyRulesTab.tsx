import { CopyAssignmentStrategyRules } from "../../../types/broadcast-tool";
import CopyAssignmentStrategiesEditor from "../CopyAssignmentStrategiesEditor";
import {
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";

interface CopyAssignmentStrategyRulesTabProps {
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
  onChange: (updated: CopyAssignmentStrategyRules) => void;
}

const CopyAssignmentStrategyRulesTab: React.FC<
  CopyAssignmentStrategyRulesTabProps
> = ({ copyAssignmentStrategyRules, onChange }) => {
  return (
    <RuleContainer>
      <InputGroup>
        <CopyAssignmentStrategiesEditor
          items={copyAssignmentStrategyRules.strategies}
          onChange={(strategies) =>
            onChange({
              ...copyAssignmentStrategyRules,
              strategies,
            })
          }
          title="Copy Assignment Strategies"
        />
      </InputGroup>
    </RuleContainer>
  );
};

export default CopyAssignmentStrategyRulesTab;
