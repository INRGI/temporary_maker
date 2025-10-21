import ClosingNotification from "../../components/Common/ClosingNotification/ClosingNotification";
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
      <ClosingNotification docUrl="https://wiki.epcnetwork.dev/uk/EPC_prod/Copy_Maker" newUrl="https://prodepc.com/pages/copy-automation/copymaker"/>
    </Container>
  );
};

export default Organic;
