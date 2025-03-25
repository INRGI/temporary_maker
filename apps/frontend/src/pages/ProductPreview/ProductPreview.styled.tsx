import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #2b2b2b;
  background-image: linear-gradient(to bottom right, #1e1e1e, #3a3a3a);
  height: calc(100vh - 40px);
  width: calc(100% - 40px);
`;

export const InputGroup = styled.div`
  display: flex;
  max-width: calc(100%);
  align-items: center;
  gap: 30px;
  background-color: #3c3c3c;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid transparent;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export const InputContainer = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  max-width: calc(100% - 100px);
  width: 100%;
`;

export const CopiesList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  padding: 0;
  height: auto;
  max-height: calc();
  min-height: calc();
  overflow-y: auto;
`;

export const CopyCard = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #5c5c5c;
  padding: 10px 15px;
  border-radius: 8px;
  border: 2px solid transparent;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  width: calc(100% - 40px);
  color: #fff;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  h2 {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    padding-right: 15px;
    max-width: 90%;
    color: #fff;
  }

  p {
    color: #fff;
    padding: 0;
    margin: 0;
  }

  div {
    display: flex;
    gap: 10px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0;
`;

export const SubmitButton = styled.button`
  padding: 13px 20px;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
  width: 100%;
  max-width: 100px;

  &:hover {
    background-color: #5941a9;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(106, 90, 205, 0.6);
  }
`;
