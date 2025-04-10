import { useState } from "react";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import axios from "axios";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { LinkUrl } from "../../../types";
import {
  InputContainer,
  InputGroup,
} from "../../../pages/ProductPreview/ProductPreview.styled";
import { Button, Container, Copy } from "./BuildSpaceAdLink.styled";
import AdminModal from "../../Common/AdminModal";
import { BsCopy } from "react-icons/bs";

interface Props {
  linkUrl: LinkUrl;
  onClose: () => void;
  isOpen: boolean;
}

const BuildSpaceAdLink: React.FC<Props> = ({ linkUrl, onClose, isOpen }) => {
  const [copyName, setCopyName] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = async () => {
    if (!copyName) {
      toastError("Please enter Copy Name");
      return;
    }

    try {
      const response = await axios.post("/api/finances/copy/space-ad-build-link", {
        copyName,
        linkUrl,
      });

      if (!response.data || response.data === 'urlhere') {
        toastError("Failed to build link");
        return;
      }
      setLink(response.data);

      toastSuccess("Link built successfully");
    } catch (error) {
      toastError("Failed to build link");
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <Container>
        <InputGroup>
          {link && (
            <Copy
              onClick={() => {
                navigator.clipboard.writeText(link);
                toastSuccess("Copied to clipboard");
              }}
              type="button"
            >
              <BsCopy />
            </Copy>
          )}
          <InputContainer>
            <FloatingLabelInput
              placeholder="Enter Copy Name"
              value={copyName}
              onChange={(e) => setCopyName(e.target.value)}
            />
          </InputContainer>
          <Button onClick={handleSubmit}>Build Link</Button>
        </InputGroup>
      </Container>
    </AdminModal>
  );
};

export default BuildSpaceAdLink;
