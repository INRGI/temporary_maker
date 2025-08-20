import styled from "@emotion/styled";

export const Container = styled.div`
    height: 80vh;
    overflow-y: scroll;
    background-color: #fff;
`;

export const ModalContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 80vh;
  background: #fff;
`;

export const PreviewPane = styled.div`
  position: relative;
  border-right: 1px solid #eaeaea;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

export const PreviewPadding = styled.div`
  padding: 16px;
`;

export const Toolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 9999;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 10px;
  background: rgba(250, 250, 250, 0.95);
  border-bottom: 1px solid #eee;
  backdrop-filter: blur(3px);
`;

export const BottomToolbar = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 10px;
  background: rgba(250, 250, 250, 0.95);
  border-top: 1px solid #eee;
  backdrop-filter: blur(3px);
`;

export const Label = styled.div`
  font-size: 12px;
  color: #666;
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Select = styled.select`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px 8px;
  background: #fff;
  font-size: 13px;
`;

export const Input = styled.input`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px 8px;
  background: #fff;
  font-size: 13px;
  width: calc(100% - 18px);
  max-width: 80px;
`;

export const Button = styled.button<{ active?: boolean }>`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 4px 8px;
  background: ${({ active }) => (active ? "#eaeaea" : "#fff")};
  cursor: pointer;
`;

export const TinyBtn = styled(Button)`
  padding: 4px 8px;
  font-size: 12px;
`;

export const Overlay = styled.div`
  position: absolute;
  pointer-events: none;
  border: 1.5px dashed rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  z-index: 2;
`;
export const ActiveOverlay = styled(Overlay)`
  border: 2px solid #2684ff;
`;

export const HtmlPane = styled.div`
  background: #f5f5f5;
  overflow-y: auto;
  padding: 12px;
`;