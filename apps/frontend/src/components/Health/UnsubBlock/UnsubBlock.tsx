import React, { useState, useEffect } from "react";
import { Preset, UnsubLinkUrl } from "../../../types/health";
import { toastSuccess, toastError } from "../../../helpers/toastify";
import Dropdown from "../../Common/Dropdown/Dropdown";
import {
  SaveButton,
  InputGroup,
  StyledCheckbox,
  SpanWhite,
} from "./UnsubBlock.styled";
import Loader from "../../Common/Loader";
import {
  Container,
  LeftContainer,
  RightContainer,
} from "../StylesBlock/StylesBlock.styled";
import DefaultUnsubBlockBuilder from "./DefaultUnsubBlockBuilder";
import CustomUnsubBlockBuilder from "./CustomUnsubBlockBuilder";

interface Props {
  preset: Preset;
}

const UnsubBlock: React.FC<Props> = ({ preset }) => {
  const [loading, setLoading] = useState(false);
  const [unsubLinkUrl, setUnsubLinkUrl] = useState<UnsubLinkUrl>({
    unsubHtmlBlock: preset?.unsubLinkUrl?.unsubHtmlBlock || {
      isUnsubHtmlBlock: false,
      htmlType: "default",
      defaultHtmlBlock: {
        linkColor: "",
        fontSize: "",
        fontFamily: "",
        textColor: "",
        padding: {
          top: "",
          right: "",
          bottom: "",
          left: "",
        },
      },
      customHtmlBlock: {
        htmlStart: "",
        htmlEnd: "",
        linkStart: "",
        linkEnd: "",
      },
    },
  });

  const [isUnsubLinkUrl, setIsUnsubLinkUrl] = useState(
    preset?.copyWhatToReplace?.isUnsubLink || false
  );
  const [isUnsubHtmlBlock, setIsUnsubHtmlBlock] = useState(
    preset?.unsubLinkUrl?.unsubHtmlBlock?.isUnsubHtmlBlock || false
  );


  useEffect(() => {
    setLoading(true);
    const savedPreset = JSON.parse(localStorage.getItem("health-presets") || "[]");
    const presetFromStorage = savedPreset.find(
      (p: Preset) => p.name === preset.name
    );

    if (presetFromStorage?.copyWhatToReplace?.isUnsubLink) {
      setIsUnsubLinkUrl(presetFromStorage.copyWhatToReplace.isUnsubLink);
    }
    if (presetFromStorage?.unsubLinkUrl) {
      setUnsubLinkUrl(presetFromStorage.unsubLinkUrl);
    }
    
    setLoading(false);
  }, [preset]);


  const handleSave = () => {
    try {
      if (isUnsubLinkUrl) {
        
        if (isUnsubHtmlBlock) {
          if (unsubLinkUrl.unsubHtmlBlock?.htmlType === "custom") {
            const customBlock = unsubLinkUrl.unsubHtmlBlock?.customHtmlBlock;
            if (!customBlock || 
                customBlock.htmlStart === "" || 
                customBlock.htmlEnd === "" || 
                customBlock.linkStart === "" || 
                customBlock.linkEnd === "") {
              toastError("All custom HTML block fields are required.");
              return;
            }
          } else if (unsubLinkUrl.unsubHtmlBlock?.htmlType === "default") {
            const defaultBlock = unsubLinkUrl.unsubHtmlBlock?.defaultHtmlBlock;
            if (!defaultBlock || 
                defaultBlock.fontSize === "" || 
                defaultBlock.fontFamily === "" || 
                defaultBlock.textColor === "" || 
                defaultBlock.linkColor === "" || 
                defaultBlock.padding.top === "" || 
                defaultBlock.padding.right === "" || 
                defaultBlock.padding.bottom === "" || 
                defaultBlock.padding.left === "") {
              toastError("All default HTML block fields are required.");
              return;
            }
          } else {
            toastError("Please select an HTML block type.");
            return;
          }
        }
      }
  
      const savedPresets = JSON.parse(localStorage.getItem("health-presets") || "[]");
      const updatedPresets = savedPresets.map((p: Preset) =>
        p.name === preset.name
          ? {
              ...p,
              copyWhatToReplace: {
                ...p.copyWhatToReplace,
                isUnsubLink: isUnsubLinkUrl,
              },
              unsubLinkUrl: {
                ...unsubLinkUrl,
                unsubHtmlBlock: {
                  ...unsubLinkUrl.unsubHtmlBlock,
                  isUnsubHtmlBlock: isUnsubHtmlBlock,
                },
              },
            }
          : p
      );
  
      localStorage.setItem("health-presets", JSON.stringify(updatedPresets));
      toastSuccess("Preset updated successfully.");
    } catch (error) {
      toastError("Error saving preset.");
    }
  };


  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <LeftContainer>
        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={isUnsubLinkUrl}
            onChange={() => setIsUnsubLinkUrl((prev) => !prev)}
          />
          <SpanWhite>Enable unsub building?</SpanWhite>
        </InputGroup>


        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={isUnsubHtmlBlock}
            onChange={() => setIsUnsubHtmlBlock((prev) => !prev)}
          />
          <SpanWhite>Enable unsub html block building?</SpanWhite>
        </InputGroup>

        <InputGroup>
          <SaveButton onClick={handleSave}>Save</SaveButton>
        </InputGroup>
      </LeftContainer>

      <RightContainer>
        {isUnsubHtmlBlock && (
          <>
            <InputGroup>
              <Dropdown
                placeholder="Select html block type"
                options={["default", "custom"]}
                selected={unsubLinkUrl.unsubHtmlBlock?.htmlType || "default"}
                onSelect={(value) =>
                  setUnsubLinkUrl((prev) => ({
                    ...prev,
                    unsubHtmlBlock: {
                      ...prev.unsubHtmlBlock,
                      htmlType: value as "default" | "custom",
                      isUnsubHtmlBlock: true,
                    },
                  }))
                }
              />
            </InputGroup>

            {unsubLinkUrl.unsubHtmlBlock?.htmlType === "default" && (
              <DefaultUnsubBlockBuilder
                value={unsubLinkUrl.unsubHtmlBlock.defaultHtmlBlock}
                onChange={(defaultBlock) =>
                  setUnsubLinkUrl((prevState) => {
                    const currentUnsubHtmlBlock = prevState.unsubHtmlBlock || {
                      isUnsubHtmlBlock: true,
                      htmlType: "default",
                      defaultHtmlBlock: {
                        linkColor: "",
                        fontSize: "",
                        fontFamily: "",
                        textColor: "",
                        padding: {
                          top: "",
                          right: "",
                          bottom: "",
                          left: "",
                        },
                      },
                      customHtmlBlock: {
                        htmlStart: "",
                        htmlEnd: "",
                        linkStart: "",
                        linkEnd: "",
                      },
                    };

                    return {
                      ...prevState,
                      unsubHtmlBlock: {
                        ...currentUnsubHtmlBlock,
                        isUnsubHtmlBlock: true,
                        htmlType: "default",
                        defaultHtmlBlock: defaultBlock,
                      },
                    };
                  })
                }
              />
            )}

            {unsubLinkUrl.unsubHtmlBlock?.htmlType === "custom" && (
              <CustomUnsubBlockBuilder
                value={unsubLinkUrl.unsubHtmlBlock.customHtmlBlock}
                onChange={(customBlock) =>
                  setUnsubLinkUrl((prevState) => {
                    const currentUnsubHtmlBlock = prevState.unsubHtmlBlock || {
                      isUnsubHtmlBlock: true,
                      htmlType: "custom",
                      defaultHtmlBlock: {
                        linkColor: "",
                        fontSize: "",
                        fontFamily: "",
                        textColor: "",
                        textAlign: "center",
                        fontWeight: "400",
                        padding: {
                          top: "",
                          right: "",
                          bottom: "",
                          left: "",
                        },
                      },
                      customHtmlBlock: {
                        htmlStart: "",
                        htmlEnd: "",
                        linkStart: "",
                        linkEnd: "",
                      },
                    };

                    return {
                      ...prevState,
                      unsubHtmlBlock: {
                        ...currentUnsubHtmlBlock,
                        isUnsubHtmlBlock: true,
                        htmlType: "custom",
                        customHtmlBlock: customBlock,
                      },
                    };
                  })
                }
              />
            )}
          </>
        )}
      </RightContainer>
    </Container>
  );
};

export default UnsubBlock;
