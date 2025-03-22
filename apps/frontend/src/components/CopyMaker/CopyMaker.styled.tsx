import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #3a3a3a;
  padding: 25px;
  margin-left: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  max-width: 570px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0;
`;

export const ButtonsHeaderContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 20px;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const CopiesList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  padding: 0;
  height: auto;
  max-height: 500px;
  min-height: 500px;
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

export const TextTitle = styled.p`
  font-weight: bold;
  font-size: 18px;
`;

export const Text = styled.span`
  font-size: 17px;
  font-weight: normal;
`;


export const TextSpaceDivider = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
`;

export const CopyButton = styled.button`
  align-items: center;
  appearance: none;
  background-color: #6a5acd;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #5941a9 0 -3px 0 inset;
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 35px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding: 5px 7px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
  &:focus {
    box-shadow: #5941a9 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #5941a9 0 -3px 0 inset;
  }

  &:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #5941a9 0 -3px 0 inset;
    transform: translateY(-1px);
  }

  &:active {
    box-shadow: #5941a9 0 3px 7px inset;
    transform: translateY(1px);
  }
`;

export const DownloadButton = styled.a`
  text-decoration: none;
  align-items: center;
  appearance: none;
  background-color: #6a5acd;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #5941a9 0 -3px 0 inset;
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 35px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding: 5px 7px;
  min-width: 30px;
  position: relative;
  text-align: left;
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;
  white-space: nowrap;
  font-size: 18px;
  
  &:focus {
    box-shadow: #5941a9 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #5941a9 0 -3px 0 inset;
  }

  &:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #5941a9 0 -3px 0 inset;
    transform: translateY(-1px);
  }

  &:active {
    box-shadow: #5941a9 0 3px 7px inset;
    transform: translateY(1px);
  }
`;

export const ImagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
`;

export const ImageCard = styled.div`
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 0;
  align-items: center;
  background-color: #3c3c3c;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid transparent;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export const ImagePreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1e1e1e;
  overflow: hidden;
  width: 60px;
  min-width: 60px;
  height: 60px;
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

export const ReplaceButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
  width: 100%;
  max-width: 100px;
  height: 35px;

  &:hover {
    background-color: #5941a9;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
  }
`;

export const AddButton = styled(ReplaceButton)``;

export const PreviewButton = styled(ReplaceButton)`
  background-color: #fca311;

  &:hover {
    background-color: #e19110;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
`;