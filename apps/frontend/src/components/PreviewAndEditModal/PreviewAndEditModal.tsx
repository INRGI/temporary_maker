import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import AdminModal from "../AdminModal";
import Editor from "@monaco-editor/react";

const ModalContainer = styled.div`
  display: flex;
  height: 80vh;
  background-color: #fff;
`;

const HtmlPreview = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  border-right: 1px solid #e0e0e0;
`;

const HtmlEditor = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #f5f5f5;
`;

interface Props {
  html: string;
  onClose: () => void;
  isOpen: boolean;
  onChange: (newHtml: string) => void;
}

const PreviewAndEditModal: React.FC<Props> = ({ html, onClose, isOpen, onChange }) => {
  const [localHtml, setLocalHtml] = useState(html);

  useEffect(() => {
    setLocalHtml(html);
  }, [html]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setLocalHtml(value);
      onChange(value);
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <ModalContainer>
        <HtmlPreview dangerouslySetInnerHTML={{ __html: localHtml }} />
        <HtmlEditor style={{ position: "relative", zIndex: 1 }}>
          <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-light"
            value={localHtml}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </HtmlEditor>
      </ModalContainer>
    </AdminModal>
  );
};

export default PreviewAndEditModal;
