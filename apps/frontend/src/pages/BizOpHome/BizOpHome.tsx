import PresetContainer from "../../components/BizOp/PresetContainer/PresetContainer";
import {
  Container,
  LinkNotification,
  TextNotification,
} from "./BizOpHome.styled";

const BizOpHome: React.FC = () => {
  return (
    <Container>
      <PresetContainer />
      <TextNotification>
        Copies not found? Add missed ones{" "}
        <LinkNotification
          target="_blank"
          href="https://docs.google.com/spreadsheets/d/1kJT1_YLuDKwYcwpxTMm38JClRUH3f7XPY0P4MUhEPNk/edit?gid=261505358#gid=261505358"
        >
          here
        </LinkNotification>
      </TextNotification>
    </Container>
  );
};

export default BizOpHome;
