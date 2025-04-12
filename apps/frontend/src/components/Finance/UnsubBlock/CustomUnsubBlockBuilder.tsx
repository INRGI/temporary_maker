import React from "react";
import { CustomUnsubBlock } from "../../../types/finance";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import { InputGroup, InputContainer } from "../UnsubBlock/UnsubBlock.styled";

interface Props {
  value?: CustomUnsubBlock;
  onChange: (value: CustomUnsubBlock) => void;
}

const CustomUnsubBlockBuilder: React.FC<Props> = ({ value, onChange }) => {
  const safeValue: CustomUnsubBlock = {
    htmlStart: value?.htmlStart || '',
    htmlEnd: value?.htmlEnd || '',
    linkStart: value?.linkStart || '',
    linkEnd: value?.linkEnd || '',
  };

  const handleChange = (key: keyof CustomUnsubBlock, val: string) => {
    onChange({ ...safeValue, [key]: val });
  };

  return (
    <>
      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="HTML Start, e.g. <div style='...'>"
            value={safeValue.htmlStart}
            onChange={(e) => handleChange("htmlStart", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="HTML End, e.g. </div>"
            value={safeValue.htmlEnd}
            onChange={(e) => handleChange("htmlEnd", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Link Start, e.g. <a href='urlhere'>"
            value={safeValue.linkStart}
            onChange={(e) => handleChange("linkStart", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Link End, e.g. </a>"
            value={safeValue.linkEnd}
            onChange={(e) => handleChange("linkEnd", e.target.value)}
          />
        </InputContainer>
      </InputGroup>
    </>
  );
};

export default CustomUnsubBlockBuilder;
