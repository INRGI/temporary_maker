import { UsageRules } from "../../../types/broadcast-tool";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";

interface UsageRulesTabProps {
  usageRules: UsageRules;
  onChange: (updated: UsageRules) => void;
}

const UsageRulesTab: React.FC<UsageRulesTabProps> = ({
  usageRules,
  onChange,
}) => {
  return (
    <RuleContainer>
      <InputGroup>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Product Min Delay Per Day"
            value={usageRules.productMinDelayPerDays}
            onChange={(e) =>
              onChange({
                ...usageRules,
                productMinDelayPerDays: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Copy Min Delay Per Day"
            value={Number(usageRules.copyMinDelayPerDays)}
            onChange={(e) =>
              onChange({
                ...usageRules,
                copyMinDelayPerDays: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="General Tab Copy Limit"
            value={Number(usageRules.generalTabCopyLimit)}
            onChange={(e) =>
              onChange({
                ...usageRules,
                generalTabCopyLimit: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>
    </RuleContainer>
  );
};

export default UsageRulesTab;
