import { toastError, toastSuccess } from "../../../helpers/toastify";
import AdminModal from "../AdminModal";;

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

const ImageEditorModal: React.FC<Props> = ({
  onClose,
  isOpen,
}) => {  

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <p>ImageEditorModal</p>
    </AdminModal>
  );
};

export default ImageEditorModal;
