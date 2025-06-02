import { useState } from "react";
import PresetContainer from "../../components/Finance/PresetContainer/PresetContainer";
import { Container, LinkNotification, TextNotification } from "./Home.styled";
import ImageEditorModal from "../../components/Common/ImageEditorModal/ImageEditorModal";

const Home: React.FC = () => {
  const [imageEditorModalOpen, setImageEditorModalOpen] = useState(false);
  return (
    <Container>
      <PresetContainer />
      {/* <button onClick={() => setImageEditorModalOpen(true)}>Open Image Editor</button> */}
      <TextNotification>
        Copies not found? Add missed ones{" "}
        <LinkNotification
          target="_blank"
          href="https://docs.google.com/spreadsheets/d/1kJT1_YLuDKwYcwpxTMm38JClRUH3f7XPY0P4MUhEPNk/edit?gid=0#gid=0"
        >
          here
        </LinkNotification>
      </TextNotification>
      <ImageEditorModal isOpen={imageEditorModalOpen} onClose={() => setImageEditorModalOpen(false)} />
    </Container>
  );
};

export default Home;
