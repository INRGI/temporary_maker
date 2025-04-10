import AdminModal from "../AdminModal";
import { Container } from "./PreviewModal.styled";

interface Props {
  html: string;
  onClose: () => void;
  isOpen: boolean;
}

const PreviewModal: React.FC<Props> = ({ html, onClose, isOpen }) => {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <Container>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </AdminModal>
  );
};

export default PreviewModal;
