import React from 'react';
import styled from '@emotion/styled';
import { FiLink } from 'react-icons/fi';

type LinkIndicatorProps = {
  link: string;
};

const Indicator = styled.div<{ isValid: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ isValid }) => (isValid ? '#4caf50' : '#f44336')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  position: relative;
  font-size: 12px;

  &:focus,
  &:hover {
    outline: none;

    &::after {
      content: attr(data-tooltip);
      position: absolute;
      top: 50%;
      left: calc(100% + 8px);
      transform: translateY(-50%);
      background: #333;
      color: #fff;
      font-size: 10px;
      padding: 4px 6px;
      border-radius: 4px;
      white-space: nowrap;
      z-index: 10;
    }
  }
`;

export const LinkIndicator: React.FC<LinkIndicatorProps> = ({ link }) => {
  const isValid = link !== 'urlhere';

  return (
    <Indicator
      tabIndex={0}
      isValid={isValid}
      data-tooltip={link}
      aria-label={link}
    >
      <FiLink size={12} />
    </Indicator>
  );
};
