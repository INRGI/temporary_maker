import { toastError, toastSuccess } from "../../../helpers/toastify";
import axios from "axios";
import { useState } from "react";
import AdminModal from "../../Common/AdminModal";
import { Button, Container, LoaderContainer } from "./MakeCopyModal.styled";
import {
  InputContainer,
  InputGroup,
} from "../../../pages/ProductPreview/ProductPreview.styled";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import { Preset } from "../../../types/finance";
import { ResponseCopy } from "../../../types/finance/copy-response";
import { SmallLoader } from "../../Common/Loader";

interface Props {
  preset: Preset;
  onClose: () => void;
  isOpen: boolean;
  onCopyMade: (copy: ResponseCopy) => void;
}

const MakeCopyModal: React.FC<Props> = ({
  preset,
  onClose,
  isOpen,
  onCopyMade,
}) => {
  const [copyName, setCopyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!copyName) {
      toastError("Please enter Copy Name");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/finances/copy/make-copy", {
        copyName,
        preset,
      });

      toastSuccess("Copy made successfully");

      if (response.data) {
        onCopyMade(response.data);
      }

      setLoading(false);
      onClose();
    } catch (error) {
      toastError("Failed to make copy");
      setLoading(false);
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <Container>
        <InputGroup>
          {loading && (
            <LoaderContainer>
              <SmallLoader />
            </LoaderContainer>
          )}
          {!loading && (
            <>
              <InputContainer>
                <FloatingLabelInput
                  placeholder="Enter Copy Name"
                  value={copyName}
                  onChange={(e) => setCopyName(e.target.value)}
                />
              </InputContainer>
              <Button onClick={handleSubmit}>Make Copy</Button>
            </>
          )}
        </InputGroup>
      </Container>
    </AdminModal>
  );
};

export default MakeCopyModal;
