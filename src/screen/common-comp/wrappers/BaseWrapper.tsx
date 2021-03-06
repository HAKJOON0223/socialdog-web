import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<IBaseWrapper>`
  max-width: ${({ theme }) => theme.layout.screenMaxWidth};
  background-color: ${({ theme }) => theme.color.achromatic.white};
  margin: 0 auto;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  padding: ${(p) => p.p};
`;

interface IBaseWrapper {
  children: React.ReactNode;
  p?: string;
}

function BaseWrapper({ children, p }: IBaseWrapper) {
  return <Wrapper p={p}>{children}</Wrapper>;
}

BaseWrapper.defaultProps = {
  p: '0px 16px',
};

export default BaseWrapper;
