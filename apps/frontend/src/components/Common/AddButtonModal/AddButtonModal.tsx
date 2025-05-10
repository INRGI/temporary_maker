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
  AddButtonContainer,
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
  InputContainer,
} from "./AddButtonModal.styled";
import { CopyStyles } from "../../../types/finance/copy-styles.types";

interface Props {
  copy: ResponseCopy | undefined;
  copyStyles: CopyStyles;
  link: string;
  copies: ResponseCopy[];
  setCopies: React.Dispatch<React.SetStateAction<ResponseCopy[]>>;
  onClose: () => void;
  isOpen: boolean;
}

const AddButtonModal: React.FC<Props> = ({
  copy,
  copyStyles,
  link,
  copies,
  setCopies,
  onClose,
  isOpen,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);
  const selectionRange = useRef<Range | null>(null);

  const [width, setWidth] = useState("300");
  const [buttonText, setButtonText] = useState("Click here");
  const [buttonPaddingTop, setButtonPaddingTop] = useState("15");
  const [buttonPaddingBottom, setButtonPaddingBottom] = useState("15");
  const [linkPaddingTop, setLinkPaddingTop] = useState("15");
  const [linkPaddingBottom, setLinkPaddingBottom] = useState("15");
  const [fontFamily, setFontFamily] = useState(
    copyStyles.fontFamily || "Tahoma"
  );
  const [fontSize, setFontSize] = useState(copyStyles.fontSize || "20");
  const [linkColor, setLinkColor] = useState(copyStyles.linkColor || "#ffffff");
  const [bgColor, setBgColor] = useState(copyStyles.bgColor || "#000000");

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
  }, [
    width,
    buttonText,
    buttonPaddingTop,
    buttonPaddingBottom,
    fontFamily,
    fontSize,
    linkColor,
    bgColor,
    linkPaddingTop,
    linkPaddingBottom,
  ]);

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
    if (
      !linkPaddingTop ||
      !linkPaddingBottom ||
      !width ||
      !buttonText ||
      !buttonPaddingTop ||
      !buttonPaddingBottom ||
      !fontFamily ||
      !fontSize ||
      !linkColor ||
      !bgColor
    ) {
      toastError("Please provide all button data");
      return;
    }

    if (!editableRef.current) return;
    editableRef.current.focus();

    const buttonTag = `
    <table
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        width: 100%;
        border-collapse: separate;
        line-height: 100%;
        padding: ${buttonPaddingTop}px 0 ${buttonPaddingBottom}px 0;
      "
    >
      <tbody>
        <tr>
          <td
            align="center"
            bgcolor="${bgColor}"
            role="presentation"
            target="_blank"
            style="
              border: none;
              border-radius: 6px;
              cursor: auto;
              mso-padding-alt: ${buttonPaddingTop}px 0 ${buttonPaddingBottom}px 0;
              background: ${bgColor};
              font-family: ${fontFamily};
              padding: ${buttonPaddingTop}px 0 ${buttonPaddingBottom}px 0;
              width: ${width}px;
              border: none;
              border-radius: 6px;
            "
            valign="middle"
          >
            <a
              href="${link}"
              style="
                display: inline-block;
                background: ${bgColor};
                font-weight: bold;
                line-height: 1.2;
                margin: 0;
                text-decoration: none;
                text-transform: none;
                padding: ${linkPaddingTop}px 0 ${linkPaddingBottom}px 0;
                mso-padding-alt: 0px;
                border-radius: 6px;
                font-family: ${fontFamily};
                font-size: ${fontSize}px;
                color: ${linkColor};
              "
              >${buttonText}</a
            >
          </td>
        </tr>
      </tbody>
    </table>
`;

    saveToHistory();

    const sel = window.getSelection();
    sel?.removeAllRanges();
    if (selectionRange.current) sel?.addRange(selectionRange.current);

    const range = sel?.getRangeAt(0);
    if (range) {
      const temp = document.createElement("div");
      temp.innerHTML = buttonTag;
      const frag = document.createDocumentFragment();
      while (temp.firstChild) frag.appendChild(temp.firstChild);

      range.deleteContents();
      range.insertNode(frag);

      selectionRange.current = null;
      setLocalHtml(editableRef.current.innerHTML);

      toastSuccess("Button inserted");
    }
  };

  const decodeHrefEntities = (html: string) => {
    return html.replace(/&amp;/g, "&");
  };

  const handleSaveToParent = () => {
    if (!copy) return;

    const cleanedHtml = decodeHrefEntities(localHtml);
    const updatedCopy = { ...copy, html: cleanedHtml };

    const index = copies.findIndex((c) => c.copyName === copy.copyName);
    const newCopies = [...copies];
    newCopies[index] = updatedCopy;
    setCopies(newCopies);

    toastSuccess("Changes saved");
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <AddButtonContainer>
        <EditorContainer>
          <BlockHeader>
            <h2>Insert Button into Copy</h2>
          </BlockHeader>

          <Container>
            <InputContainer>
            <FloatingLabelInput
              placeholder="Button Text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
            />

            <FloatingLabelInput
              placeholder="Width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />

            <FloatingLabelInput
              placeholder="Link Color"
              value={linkColor}
              onChange={(e) => setLinkColor(e.target.value)}
            />

            <FloatingLabelInput
              placeholder="Background Color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />

            <FloatingLabelInput
              placeholder="Link Padding Top"
              value={linkPaddingTop}
              onChange={(e) => setLinkPaddingTop(e.target.value)}
            />

            <FloatingLabelInput
              placeholder="Link Padding Bottom"
              value={linkPaddingBottom}
              onChange={(e) => setLinkPaddingBottom(e.target.value)}
            />

            <FloatingLabelInput
              placeholder="Button Padding Top"
              value={buttonPaddingTop}
              onChange={(e) => setButtonPaddingTop(e.target.value)}
            />

            <FloatingLabelInput
              placeholder="Button Padding Bottom"
              value={buttonPaddingBottom}
              onChange={(e) => setButtonPaddingBottom(e.target.value)}
            />

            <FloatingLabelInput
              placeholder="Font Family"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            />

            <FloatingLabelInput
              placeholder="Font Size"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            />
            </InputContainer>
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
      </AddButtonContainer>
    </AdminModal>
  );
};

export default AddButtonModal;
