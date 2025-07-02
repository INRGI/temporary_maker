import {
  GetDomainStatusesResponse,
  GetProductStatusesResponse,
} from "../../../api/monday";
import { ProductRules } from "../../../types/broadcast-tool";
import ArrayInput from "../../Common/ArrayInput";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import MultiSelectDropdown from "../../Common/MultiSelectDropdown";
import StringArrayEditor from "../StringArrayEditor";
import {
  CheckboxWithLabel,
  InputContainer,
  InputGroup,
  LeftContainer,
  RightContainer,
  RuleContainer,
  StyledCheckbox,
  WhiteSpan,
} from "../DomainRulesTab/DomainRulesTab.styled";
import ProductAllowedDaysEditor from "../ProductAllowedDaysEditor";
import DomainSendingEditor from "../DomainSendingEditor";

interface ProductRulesTabProps {
  productRules: ProductRules;
  onChange: (updated: ProductRules) => void;
  productMondayStatuses: GetProductStatusesResponse;
  domainMondayStatuses: GetDomainStatusesResponse;
}

const ProductRulesTab: React.FC<ProductRulesTabProps> = ({
  productRules,
  onChange,
  productMondayStatuses,
  domainMondayStatuses,
}) => {
  return (
    <RuleContainer style={{ flexDirection: "row" }}>
      <LeftContainer>
        <InputGroup>
          <StringArrayEditor
            items={productRules.blacklistedCopies}
            onChange={(newList) =>
              onChange({
                ...productRules,
                blacklistedCopies: newList,
              })
            }
            title="Blacklisted Copies"
            keyLabel="Copy Name"
            keyPlaceholder="Enter copy name"
          />
        </InputGroup>

        <InputGroup>
          <InputContainer>
            <MultiSelectDropdown
              options={productMondayStatuses.productStatuses}
              selected={productRules.allowedMondayStatuses}
              onChange={(newValues) =>
                onChange({
                  ...productRules,
                  allowedMondayStatuses: newValues,
                })
              }
              placeholder="Allowed Monday Statuses"
            />
          </InputContainer>
        </InputGroup>

        <InputGroup disabled={true}>
          <InputContainer>
            <FloatingLabelNumberInput
              placeholder="Min Conversion For Clickable Copy"
              value={productRules.minConversionForClickableCopy}
              onChange={(e) =>
                onChange({
                  ...productRules,
                  minConversionForClickableCopy: Number(e.target.value),
                })
              }
            />
          </InputContainer>
        </InputGroup>

        <InputGroup disabled={true}>
          <CheckboxWithLabel>
            <StyledCheckbox
              type="checkbox"
              checked={productRules.allowSimilarCopies}
              onChange={() =>
                onChange({
                  ...productRules,
                  allowSimilarCopies: !productRules.allowSimilarCopies,
                })
              }
            />

            <WhiteSpan>Allow Similar Copies</WhiteSpan>
          </CheckboxWithLabel>
        </InputGroup>

        <InputGroup>
          <ArrayInput
            items={productRules.productsSendingLimitPerDay.map((item) => ({
              key: item.productName,
              value: item.limit.toString(),
            }))}
            keyLabel="Product Name"
            valueLabel="Limit"
            title="Products Sending Limit Per Day"
            onChange={(newItems) =>
              onChange({
                ...productRules,
                productsSendingLimitPerDay: newItems.map((item) => ({
                  productName: item.key,
                  limit: Number(item.value),
                })),
              })
            }
          />
        </InputGroup>

        <InputGroup>
          <ArrayInput
            items={productRules.copySendingLimitPerDay.map((item) => ({
              key: item.copyName,
              value: item.limit.toString(),
            }))}
            keyLabel="Copy Name"
            valueLabel="Limit"
            title="Copies Sending Limit Per Day"
            onChange={(newItems) =>
              onChange({
                ...productRules,
                copySendingLimitPerDay: newItems.map((item) => ({
                  copyName: item.key,
                  limit: Number(item.value),
                })),
              })
            }
          />
        </InputGroup>

        <InputGroup>
          <ArrayInput
            items={productRules.copyMinLimitPerDay.map((item) => ({
              key: item.copyName,
              value: item.limit.toString(),
            }))}
            keyLabel="Copy Name"
            valueLabel="Limit"
            title="Copies Min Limit Per Day"
            onChange={(newItems) =>
              onChange({
                ...productRules,
                copyMinLimitPerDay: newItems.map((item) => ({
                  copyName: item.key,
                  limit: Number(item.value),
                })),
              })
            }
          />
        </InputGroup>
      </LeftContainer>

      <RightContainer>
        <InputGroup>
          <ProductAllowedDaysEditor
            items={productRules.productAllowedSendingDays}
            onChange={(updated) =>
              onChange({
                ...productRules,
                productAllowedSendingDays: updated,
              })
            }
          />
        </InputGroup>

        <InputGroup>
          <DomainSendingEditor
            items={productRules.domainSending}
            onChange={(newItems) =>
              onChange({
                ...productRules,
                domainSending: newItems,
              })
            }
            title="Domain Sending Rules"
            parentCompanies={domainMondayStatuses.uniqueParentCompanies}
            mondayStatuses={productMondayStatuses.domainSendings}
          />
        </InputGroup>
      </RightContainer>
    </RuleContainer>
  );
};

export default ProductRulesTab;
