import { useState } from "react";
import AdminModal from "../AdminModal";
import {
  BlockHeader,
  Container,
  TabButton,
  TabsContainer,
  UpdatePresetContainer,
} from "./PresetUpdateModal.styled";
import StylesBlock from "../StylesBlock/StylesBlock";
import LinkBlock from "../LinkBlock/LinkBlock";
import UnsubBlock from "../UnsubBlock/UnsubBlock";
import SubjectBlock from "../SubjectBlock/SubjectBlock";
import BotTrapBlock from "../BotTrapBlock/BotTrapBlock";
import { Preset } from "../../types";

interface PresetUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  preset: Preset;
}

const PresetUpdateModal: React.FC<PresetUpdateModalProps> = ({
  isOpen,
  onClose,
  preset,
}) => {
  const [currentPreset, setCurrentPreset] = useState<Preset>(preset);
  const [activeTab, setActiveTab] = useState("styles");

  const renderContent = () => {
    switch (activeTab) {
      case "styles":
        return <StylesBlock preset={currentPreset} />;
      case "link":
        return <LinkBlock preset={currentPreset}/>;
      case "unsub":
        return <UnsubBlock preset={currentPreset}/>;
      case "subject":
        return <SubjectBlock preset={currentPreset} />;
      case "bottrap":
        return <BotTrapBlock preset={currentPreset} />;
      default:
        return null;
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <UpdatePresetContainer>
        <BlockHeader>
          <h2>Add Styles and more</h2>
        </BlockHeader>
        <TabsContainer>
            <TabButton
              active={activeTab === "styles"}
              onClick={() => setActiveTab("styles")}
            >
              Styles
            </TabButton>
            <TabButton
              active={activeTab === "link"}
              onClick={() => setActiveTab("link")}
            >
              Link
            </TabButton>
            <TabButton
              active={activeTab === "unsub"}
              onClick={() => setActiveTab("unsub")}
            >
              Unsub
            </TabButton>
            <TabButton
              active={activeTab === "subject"}
              onClick={() => setActiveTab("subject")}
            >
              Subject
            </TabButton>
            <TabButton
              active={activeTab === "bottrap"}
              onClick={() => setActiveTab("bottrap")}
            >
              Bot Trap
            </TabButton>
          </TabsContainer>
        <Container>
        {renderContent()}
        </Container>
      </UpdatePresetContainer>
    </AdminModal>
  );
};

export default PresetUpdateModal;
