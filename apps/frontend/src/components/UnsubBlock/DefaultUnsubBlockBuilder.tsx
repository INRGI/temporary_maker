import React from "react";
import { DefaultUnsubBlock } from "../../types";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";
import {
  InputGroup,
  InputContainer,
  OverflowContainer,
} from "../UnsubBlock/UnsubBlock.styled";

interface Props {
  value?: DefaultUnsubBlock;
  onChange: (value: DefaultUnsubBlock) => void;
}

const DefaultUnsubBlockBuilder: React.FC<Props> = ({ value, onChange }) => {
  const safeValue: DefaultUnsubBlock = {
    fontSize: value?.fontSize || "",
    fontFamily: value?.fontFamily || "",
    textColor: value?.textColor || "",
    linkColor: value?.linkColor || "",
    padding: {
      top: value?.padding?.top || "",
      right: value?.padding?.right || "",
      bottom: value?.padding?.bottom || "",
      left: value?.padding?.left || "",
    },
  };

  const handleChange = (key: keyof DefaultUnsubBlock, val: string) => {
    onChange({ ...safeValue, [key]: val });
  };

  const handlePaddingChange = (
    key: keyof DefaultUnsubBlock["padding"],
    val: string
  ) => {
    onChange({
      ...safeValue,
      padding: {
        ...safeValue.padding,
        [key]: val,
      },
    });
  };

  return (
    <OverflowContainer>
      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Font Size, e.g. 14px"
            value={safeValue.fontSize}
            onChange={(e) => handleChange("fontSize", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Font Family, e.g. Arial"
            value={safeValue.fontFamily}
            onChange={(e) => handleChange("fontFamily", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Text Color, e.g. #000000"
            value={safeValue.textColor}
            onChange={(e) => handleChange("textColor", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Link Color, e.g. #0066cc"
            value={safeValue.linkColor}
            onChange={(e) => handleChange("linkColor", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Padding Top (e.g. 0)"
            value={safeValue.padding.top}
            onChange={(e) => handlePaddingChange("top", e.target.value)}
          />
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Padding Right (e.g. 0)"
            value={safeValue.padding.right}
            onChange={(e) => handlePaddingChange("right", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Padding Bottom (e.g. 0)"
            value={safeValue.padding.bottom}
            onChange={(e) => handlePaddingChange("bottom", e.target.value)}
          />
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Padding Left (e.g. 0)"
            value={safeValue.padding.left}
            onChange={(e) => handlePaddingChange("left", e.target.value)}
          />
        </InputContainer>
      </InputGroup>
    </OverflowContainer>
  );
};

export default DefaultUnsubBlockBuilder;
