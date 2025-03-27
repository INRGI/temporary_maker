import PresetContainer from "../../components/PresetContainer/PresetContainer";
import { Container, LinkNotification, TextNotification } from "./Home.styled";

const Home: React.FC = () => {
  return (
    <Container>
     <PresetContainer />
     <TextNotification>Copies not found? Add missed ones <LinkNotification target="_blank" href="https://docs.google.com/spreadsheets/d/1kJT1_YLuDKwYcwpxTMm38JClRUH3f7XPY0P4MUhEPNk/edit?gid=0#gid=0">here</LinkNotification></TextNotification>
    </Container>
  );
};

export default Home;
