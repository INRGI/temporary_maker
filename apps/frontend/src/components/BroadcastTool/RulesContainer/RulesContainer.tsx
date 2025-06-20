import { BroadcastRulesEntity } from "../../../types/broadcast-tool/broadcast-rules-entity.interface";
import { Container } from "./RulesContainer.styled";

interface RulesContainerProps {
    broadcastEntity: BroadcastRulesEntity
}

const RulesContainer: React.FC<RulesContainerProps> = ({broadcastEntity}) => {
  return <Container>RulesContainer</Container>;
};

export default RulesContainer;
