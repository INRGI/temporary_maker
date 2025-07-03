import PresetContainer from "../../components/Organic/PresetContainer/PresetContainer";
import {
  Container,
  LinkNotification,
  TextNotification,
} from "./Organic.styled";

const Organic: React.FC = () => {
  return (
    <Container>
      <PresetContainer />
      <TextNotification>
        Copies not found? Add missed ones{" "}
        <LinkNotification target="_blank" href="https://docs.google.com/spreadsheets/d/11IjNb_4Fho5s2owUWJ5a_NrsF6x1JMKxFXoZGtmo5XE/edit?usp=sharing">
          here
        </LinkNotification>
      </TextNotification>
    </Container>
  );
};

export default Organic;
