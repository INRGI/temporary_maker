import PresetContainer from "../../components/Finance/PresetContainer/PresetContainer";
import {
  Container,
  LinkNotification,
  TextNotification,
} from "./HealthHome.styled";

const HealthHome: React.FC = () => {
  return (
    <Container>
      <PresetContainer />
      <TextNotification>
        Copies not found? Add missed ones{" "}
        <LinkNotification
          target="_blank"
          href="https://docs.google.com/spreadsheets/d/1kJT1_YLuDKwYcwpxTMm38JClRUH3f7XPY0P4MUhEPNk/edit?gid=2066845096#gid=2066845096"
        >
          here
        </LinkNotification>
      </TextNotification>
    </Container>
  );
};

export default HealthHome;
