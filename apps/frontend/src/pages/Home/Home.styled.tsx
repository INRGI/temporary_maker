import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #2b2b2b;
  background-image: linear-gradient(to bottom right, #1e1e1e, #3a3a3a);
  height: calc(100vh - 40px);
`;

export const TextNotification = styled.p`
  color: #f5f5f5;
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
  padding-left: 20px;
`;

export const LinkNotification = styled.a`
  color: #ff0000;
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
  text-align: center;
  text-decoration: underline;
`;