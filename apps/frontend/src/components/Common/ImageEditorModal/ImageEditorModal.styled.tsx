import styled from "@emotion/styled";

export const EditorLayout = styled.div`
  display: flex;
  height: 90vh;
  background: #181818;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.6);
`;

export const Sidebar = styled.div`
  width: 320px;
  background: #202020;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-right: 1px solid #333;
`;

export const PanelTitle = styled.h2`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
  text-transform: uppercase;
`;

export const Label = styled.label`
  color: #ccc;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FileInput = styled.input`
  background: #2c2c2c;
  border: 1px solid #444;
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
`;

export const TemplateButton = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? "#6a5acd" : "#333")};
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ active }) => (active ? "#5a49b0" : "#444")};
  }
`;

export const TemplateList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ExportButton = styled.button`
  margin-top: auto;
  padding: 12px;
  background: #6a5acd;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #5a49b0;
  }
`;

export const CanvasArea = styled.div`
  flex: 1;
  background: repeating-conic-gradient(#2a2a2a 0% 25%, transparent 0% 50%) 50% / 40px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledCanvas = styled.canvas`
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
  background: white;
`;