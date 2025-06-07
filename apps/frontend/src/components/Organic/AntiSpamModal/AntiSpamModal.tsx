import { useState } from "react";
import AdminModal from "../../Common/AdminModal";
import {
  BlockHeader,
  Container,
  CreatePresetContainer,
  SaveButton,
} from "../../Finance/PresetCreateModal/PresetCreateModal.styled";
import Loader from "../../Common/Loader";
import axios from "axios";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import Dropdown from "../../Common/Dropdown/Dropdown";
import { Copy } from "../../Finance/BuildSpaceAdLink/BuildSpaceAdLink.styled";
import { BsCopy } from "react-icons/bs";
import { SubmitContainer } from "./AntiSpamModal.styled";

interface AntiSpamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const options = ["Spam Words Only", "Full Anti Spam"];

const AntiSpamModal: React.FC<AntiSpamModalProps> = ({ isOpen, onClose }) => {
  const [resultAntiSpam, setResultAntiSpam] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);
  const [text, setText] = useState<string>("");

  const runAntiSpam = async (option: string, text: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/organic/copy/anti-spam`, {
        antiSpamType: option,
        html: text,
      });
      setResultAntiSpam(response.data);
    } catch (error) {
      toastError("Error during Anti Spam.");
    }
    setLoading(false);
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <CreatePresetContainer>
        <BlockHeader>
          <h2>Anti Spam</h2>
        </BlockHeader>
        {loading && <Loader />}
        {!loading && (
          <Container>
            <FloatingLabelInput
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your text here"
            />

            <Dropdown
              placeholder="Anti Spam Type"
              options={options}
              selected={selectedOption}
              onSelect={(e) => setSelectedOption(e)}
            />

            <SubmitContainer>
              <SaveButton onClick={() => runAntiSpam(selectedOption, text)}>
                Run Anti Spam
              </SaveButton>
              {resultAntiSpam && (
                <Copy
                  onClick={() => {
                    navigator.clipboard.writeText(resultAntiSpam);
                    toastSuccess("Copied to clipboard");
                  }}
                  type="button"
                >
                  <BsCopy />
                </Copy>
              )}
            </SubmitContainer>
          </Container>
        )}
      </CreatePresetContainer>
    </AdminModal>
  );
};

export default AntiSpamModal;
