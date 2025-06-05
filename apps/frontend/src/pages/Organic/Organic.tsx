import {
  Container,
  LinkNotification,
  TextNotification,
} from "./Organic.styled";

const Organic: React.FC = () => {
  return (
    <Container>
      <TextNotification>
        Copies not found? Add missed ones{" "}
        <LinkNotification target="_blank" href="">
          here
        </LinkNotification>
      </TextNotification>
    </Container>
  );
};

export default Organic;
