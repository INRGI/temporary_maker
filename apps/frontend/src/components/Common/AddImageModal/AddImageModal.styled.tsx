import styled from '@emotion/styled';

export const AddImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  background-color: #181818;
  padding: 30px;
  border-radius: 12px;
  height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

export const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #202020;
  padding: 20px;
  border-radius: 12px;
`;

export const PreviewContainer = styled.div`
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
  overflow-y: auto;
  border: 2px solid #eee;
  width: 600px;
  @media (max-width: 1024px) {
    max-height: 400px;
  }
`;

export const PreviewBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  background-color: #fff;
  border-radius: 8px;
  overflow-y: auto;
  outline: none;
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #000;
`;

export const BlockHeader = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h2 {
    font-size: 22px;
    line-height: 1.3;
    color: #ffffff;
    margin: 0 0 10px;
    font-weight: 700;
    font-family: 'Arial Black', sans-serif;
    text-transform: uppercase;
    border-bottom: 2px solid #fff;
    padding-bottom: 5px;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const SaveButton = styled.button`
  padding: 12px 18px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #218838;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.6);
  }
`;

export const UndoButton = styled(SaveButton)`
  background-color: #e63946;

  &:hover {
    background-color: #b22b36;
  }

  &:focus {
    box-shadow: #b22b36 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #b22b36 0 -3px 0 inset;
  }
`;

export const RedoButton = styled(SaveButton)`
  background-color: #fca311;

  &:hover {
    background-color: #e19110;
  }

  &:focus {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #e19110 0 -3px 0 inset;
  }
`;

export const InsertButton = styled(SaveButton)`
  background-color: #6a5acd;

  &:hover {
    background-color: #5936a2;
  }

  &:focus {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6a5acd 0 -3px 0 inset;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  padding: 0;
  margin: 0;;
`;
