/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from "react";
import {
  FiCornerUpLeft,
  FiCornerUpRight,
  FiPlusCircle,
  FiSave,
} from "react-icons/fi";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { ResponseCopy } from "../../../types/finance/copy-response";
import AdminModal from "../AdminModal";
import {
  AddImageContainer,
  EditorContainer,
  PreviewContainer,
  BlockHeader,
  Container,
  SaveButton,
  PreviewBox,
  ButtonRow,
  ButtonGroup,
  InsertButton,
  RedoButton,
  UndoButton,
} from "./AddImageModal.styled";

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
  link,
  copies,
  setCopies,
  imagesSource,
  setImagesSource,
  onClose,
  isOpen,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);
  const selectionRange = useRef<Range | null>(null);

  const [newImageSrc, setNewImageSrc] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("Image");
  const [newImageWidth, setNewImageWidth] = useState("500");
  const [paddingTop, setPaddingTop] = useState("15");
  const [paddingBottom, setPaddingBottom] = useState("15");
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [localHtml, setLocalHtml] = useState<string>(copy?.html || "");

  useEffect(() => {
    if (copy?.html) setLocalHtml(copy.html);
  }, [copy]);

  useEffect(() => {
    const updateSelection = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (
          editableRef.current &&
          editableRef.current.contains(range.startContainer)
        ) {
          selectionRange.current = range.cloneRange();
        }
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleInsert();
      }
    };

    document.addEventListener("selectionchange", updateSelection);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("selectionchange", updateSelection);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [newImageSrc, newImageAlt, newImageWidth]);

  const saveToHistory = () => {
    setHistory((prev) => [...prev, localHtml]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack((prevStack) => [localHtml, ...prevStack]);
    setLocalHtml(prev);
    setHistory((prevHist) => prevHist.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((prev) => [...prev, localHtml]);
    setLocalHtml(next);
    setRedoStack((prev) => prev.slice(1));
  };

  const handleInsert = () => {
    if (!newImageSrc || !newImageAlt || !newImageWidth) {
      toastError("Please provide all image data");
      return;
    }

    if (!editableRef.current) return;
    editableRef.current.focus();

    const imgTag = `<table role="presentation" cellpadding="0" cellspacing="0" align="center" width="100%">
      <tr>
        <td align="center" style="padding-top: ${paddingTop}px; padding-bottom: ${paddingBottom}px">
          <a href="${link}" style="font-weight: 900; text-decoration: none;">
            <img width="${newImageWidth}" src="${newImageSrc}" alt="${newImageAlt}" style="width: 100%; height: auto; border: 0; max-width: ${newImageWidth}px;" />
          </a>
        </td>
      </tr>
    </table>`;

    saveToHistory();

    const sel = window.getSelection();
    sel?.removeAllRanges();
    if (selectionRange.current) sel?.addRange(selectionRange.current);

    const range = sel?.getRangeAt(0);
    if (range) {
      const temp = document.createElement("div");
      temp.innerHTML = imgTag;
      const frag = document.createDocumentFragment();
      while (temp.firstChild) frag.appendChild(temp.firstChild);

      range.deleteContents();
      range.insertNode(frag);

      selectionRange.current = null;
      setLocalHtml(editableRef.current.innerHTML);

      toastSuccess("Image inserted");
    }
  };

  const decodeHrefEntities = (html: string) => {
    return html.replace(/&amp;/g, '&');
  };
  
  const handleSaveToParent = () => {
    if (!copy) return;
  
    const cleanedHtml = decodeHrefEntities(localHtml);
    const updatedCopy = { ...copy, html: cleanedHtml };
  
    if (updatedCopy.imageLinks) {
      updatedCopy.imageLinks = [...updatedCopy.imageLinks, newImageSrc];
    } else {
      updatedCopy.imageLinks = [newImageSrc];
    }
  
    const index = copies.findIndex((c) => c.copyName === copy.copyName);
    const newCopies = [...copies];
    newCopies[index] = updatedCopy;
    setCopies(newCopies);
  
    setImagesSource([
      ...imagesSource,
      { copyName: copy.copyName, imageLink: newImageSrc },
    ]);
  
    toastSuccess("Changes saved");
  };
  

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <AddImageContainer>
        <EditorContainer>
          <BlockHeader>
            <h2>Insert Image into Copy</h2>
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
              placeholder="Width (e.g. 500)"
              value={newImageWidth}
              onChange={(e) => setNewImageWidth(e.target.value)}
            />
            <FloatingLabelInput
              placeholder="Top Padding (e.g. 15)"
              value={paddingTop}
              onChange={(e) => setPaddingTop(e.target.value)}
            />
            <FloatingLabelInput
              placeholder="Bottom Padding (e.g. 15)"
              value={paddingBottom}
              onChange={(e) => setPaddingBottom(e.target.value)}
            />

            <ButtonRow>
              <ButtonGroup>
              <UndoButton onClick={undo}>
                <FiCornerUpLeft /> Undo
              </UndoButton>
              <RedoButton onClick={redo}>
                <FiCornerUpRight /> Redo
              </RedoButton>
              </ButtonGroup>
              <ButtonGroup>
              <InsertButton onClick={handleInsert}>
                <FiPlusCircle /> Insert
              </InsertButton>
              <SaveButton onClick={handleSaveToParent}>
                <FiSave /> Save
              </SaveButton>
              </ButtonGroup>
            </ButtonRow>
          </Container>
        </EditorContainer>

        <PreviewContainer>
          <PreviewBox
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: localHtml }}
            onInput={(e) => setLocalHtml((e.target as HTMLElement).innerHTML)}
            style={{ maxWidth: "600px", margin: "0 auto", cursor: "crosshair" }}
          />
        </PreviewContainer>
      </AddImageContainer>
    </AdminModal>
  );
};

export default AddImageModal;
