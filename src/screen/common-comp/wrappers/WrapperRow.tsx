import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<IWrapperRow>`
  display: flex;
  align-items: center;
  padding: ${(p) => p.p};
  justify-content: ${(p) => p.jc};
  width: ${(p) => p.w};
  height: ${(p) => p.h};
  background-color: ${(p) => p.bc};
`;

interface IWrapperRow {
  children: React.ReactNode;
  jc?: 'space-between' | 'flex-start' | 'flex-end' | 'space-around' | 'center';
  p?: string;
  w?: string;
  h?: string;
  bc?: string;
  m?: string;
  onClick?: () => void;
}

function WrapperRow({ children, jc, p, w, h, bc, m, onClick }: IWrapperRow) {
  return (
    <Wrapper jc={jc} p={p} w={w} h={h} bc={bc} m={m} onClick={onClick}>
      {children}
    </Wrapper>
  );
}

WrapperRow.defaultProps = {
  jc: 'flex-start',
  p: '0',
  w: '',
  h: '',
  m: '',
  bc: 'none',
  onClick: () => {},
};

export default WrapperRow;
