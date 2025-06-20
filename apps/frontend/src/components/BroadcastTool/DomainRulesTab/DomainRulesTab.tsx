import { GetDomainStatusesResponse } from "../../../api/monday";
import { DomainRules } from "../../../types/broadcast-tool";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import MultiSelectDropdown from "../../Common/MultiSelectDropdown";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "./DomainRulesTab.styled";

interface DomainRulesTabProps {
  domainRules: DomainRules;
  onChange: (updated: DomainRules) => void;
  domainMondayStatuses: GetDomainStatusesResponse;
}

const DomainRulesTab: React.FC<DomainRulesTabProps> = ({
  domainRules,
  onChange,
  domainMondayStatuses
}) => {
  return (
    <RuleContainer>
      <InputGroup>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Min Clicks To Be Live"
            value={domainRules.minClicksToBeLive}
            onChange={(e) =>
              onChange({
                ...domainRules,
                minClicksToBeLive: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <FloatingLabelNumberInput
            placeholder="Average Clicks Per Day"
            value={ Number(domainRules.avarageClicksDays)}
            onChange={(e) =>
              onChange({
                ...domainRules,
                avarageClicksDays: Number(e.target.value),
              })
            }
          />
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <MultiSelectDropdown
            options={domainMondayStatuses.uniqueDomainStatuses}
            selected={domainRules.allowedMondayStatuses}
            onChange={(newValues) =>
                onChange({
                  ...domainRules,
                  allowedMondayStatuses: newValues,
                })
              }
            placeholder="Allowed Monday Statuses"
          />
        </InputContainer>
      </InputGroup>
    </RuleContainer>
  );
};

export default DomainRulesTab;
