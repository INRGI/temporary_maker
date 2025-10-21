import ClosingNotification from "../../components/Common/ClosingNotification/ClosingNotification";
import PresetContainer from "../../components/Health/PresetContainer/PresetContainer";
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
      <ClosingNotification docUrl="https://wiki.epcnetwork.dev/uk/EPC_prod/Copy_Maker_Health" newUrl="https://health.prodepc.com/pages/copy-automation/copymaker"/>
    </Container>
  );
};

export default HealthHome;
