import { useState } from "react";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";
import { toastError, toastSuccess } from "../../helpers/toastify";
import { ResponseCopy } from "../../types/copy-response";
import AdminModal from "../AdminModal";
import { CreatePresetContainer } from "../PresetCreateModal/PresetCreateModal.styled";
import { BlockHeader, Container, SaveButton } from "./AddImageModal.styled";

interface Props {
  copy: ResponseCopy | undefined;
  link: string;
  copies: ResponseCopy[];
  setCopies: React.Dispatch<React.SetStateAction<ResponseCopy[]>>;
  imagesSource: { copyName: string; imageLink: string }[];
  setImagesSource: React.Dispatch<
    React.SetStateAction<{ copyName: string; imageLink: string }[]>
  >;
  onClose: () => void;
  isOpen: boolean;
}

const AddImageModal: React.FC<Props> = ({
  copy,
  copies,
  setCopies,
  imagesSource,
  setImagesSource,
  onClose,
  isOpen,
  link,
}) => {
  const [newImageSrc, setNewImageSrc] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("Image");
  const [newImageWidth, setNewImageWidth] = useState("500");

  const handleAddImage = async () => {
    if (!copy) {
      toastError("No copy selected");
      return;
    }

    if (!newImageSrc || !newImageAlt || !newImageWidth) {
      toastError("Please provide all data");
      return;
    }

    try {
      const copyIndex = copies.findIndex((c) => c.copyName === copy.copyName);
      if (copyIndex === -1) {
        toastError("Copy not found");
        return;
      }

      const updatedCopy = { ...copies[copyIndex] };

      const imgTag = `<table role="presentation" cellpadding="0" cellspacing="0" align="center">
      <tr>
          <td align="center" style="text-align: center; padding-top: 15px">
              <a href="${link}" style="font-weight: 900; text-decoration: none;">
                  <img src="${newImageSrc}" alt="${newImageAlt}" style="width: 100%; height: auto; border: 0; -ms-interpolation-mode: bicubic; max-width: ${newImageWidth}px;" width="100%" height="auto">
              </a>
          </td>
      </tr>
  </table>`;

      const sentenceEndRegex =
        /([.!?…]["']?|\b<br\s*\/?>)[\s\r\n]*(?=<br\s*\/?>|<\/?[a-zA-Z\s]*>|$)/i;

      const matchResult = sentenceEndRegex.exec(updatedCopy.html);

      if (matchResult) {
        const endPosition = matchResult.index + matchResult[0].length;
        const beforeSentenceEnd = updatedCopy.html.substring(0, endPosition);
        const afterSentenceEnd = updatedCopy.html
          .substring(endPosition)
          .replace(/^\s*<\/?br\s*\/?>\s*/gi, "");

        updatedCopy.html = beforeSentenceEnd + imgTag + afterSentenceEnd;
      } else {
        updatedCopy.html = updatedCopy.html + imgTag;
      }

      if (updatedCopy.imageLinks) {
        updatedCopy.imageLinks = [...updatedCopy.imageLinks, newImageSrc];
      } else {
        updatedCopy.imageLinks = [newImageSrc];
      }      

      const newCopies = [...copies];
      newCopies[copyIndex] = updatedCopy;
      setCopies(newCopies);

      setImagesSource([
        ...imagesSource,
        { copyName: copy.copyName, imageLink: newImageSrc },
      ]);

      onClose();
      toastSuccess("Image added successfully");
    } catch (error) {
      toastError("Failed to add image");
      console.error(error);
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <CreatePresetContainer>
        <BlockHeader>
          <h2>Add New Image to {copy?.copyName}</h2>
        </BlockHeader>

        <Container>
          <FloatingLabelInput
            placeholder="Image URL"
            value={newImageSrc}
            onChange={(e) => setNewImageSrc(e.target.value)}
          />
          <FloatingLabelInput
            placeholder="Alt text"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
          />
          <FloatingLabelInput
            placeholder="Width (px)"
            value={newImageWidth}
            onChange={(e) => setNewImageWidth(e.target.value)}
          />

          <SaveButton onClick={handleAddImage}>Add</SaveButton>
        </Container>
      </CreatePresetContainer>
    </AdminModal>
  );
};

export default AddImageModal;
