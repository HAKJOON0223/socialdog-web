import React, { ReactNode } from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 4px;
  width: 100%;
`;

interface IWrapperInfinityScroll {
  children: ReactNode;
  fetchHandler: () => void;
}

function WrapperInfinityScroll({ children, fetchHandler }: IWrapperInfinityScroll) {
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      fetchHandler();
    }
  }, [inView]);

  return (
    <>
      {children}
      <Wrapper ref={ref} />
    </>
  );
}

export default WrapperInfinityScroll;
