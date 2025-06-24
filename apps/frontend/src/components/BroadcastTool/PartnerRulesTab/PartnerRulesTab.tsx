import { PartnerRules } from "../../../types/broadcast-tool";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import MultiSelectDropdown from "../../Common/MultiSelectDropdown";
import {
  CheckboxWithLabel,
  InputContainer,
  InputGroup,
  RuleContainer,
  StyledCheckbox,
  WhiteSpan,
} from "../DomainRulesTab/DomainRulesTab.styled";

interface PartnerRulesTabProps {
  partnerRules: PartnerRules;
  onChange: (updated: PartnerRules) => void;
}

const allowedIspsForNewPartnersOptions = [
  "Gmail",
  "Yahoo",
  "MS",
  "Apple",
  "Other",
];

const PartnerRulesTab: React.FC<PartnerRulesTabProps> = ({
  partnerRules,
  onChange,
}) => {
  return (
    <RuleContainer>
      <InputGroup disabled={true}>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Days Sending For New Partners"
            value={partnerRules.daysSendingForNewPartners}
            onChange={(e) =>
              onChange({
                ...partnerRules,
                daysSendingForNewPartners: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>

      <InputGroup disabled={true}>
        <CheckboxWithLabel>
          <StyledCheckbox
            type="checkbox"
            checked={partnerRules.useNewPartnerForClickableCopies}
            onChange={() =>
              onChange({
                ...partnerRules,
                useNewPartnerForClickableCopies:
                  !partnerRules.useNewPartnerForClickableCopies,
              })
            }
          />

          <WhiteSpan>Use New Partner For Clickable Copies</WhiteSpan>
        </CheckboxWithLabel>
      </InputGroup>

      <InputGroup disabled={true}>
        <InputContainer>
          <MultiSelectDropdown
            options={allowedIspsForNewPartnersOptions}
            selected={partnerRules.allowedIspsForNewPartners}
            onChange={(newValues) =>
              onChange({
                ...partnerRules,
                allowedIspsForNewPartners: newValues,
              })
            }
            placeholder="Allowed ISPs For New Partners"
          />
        </InputContainer>
      </InputGroup>
    </RuleContainer>
  );
};

export default PartnerRulesTab;
