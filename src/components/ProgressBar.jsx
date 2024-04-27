import React from 'react';
import styled from 'styled-components';

const ProgressBar = ({ progress }) => {
  return (
    <Container>
      <Filler style={{ width: `${progress}%` }} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 20px;
  background-color: #f2f2f2;
  border-radius: 10px;
  margin-top: 10px;
`;

const Filler = styled.div`
  height: 100%;
  background-color: #276EF1;
  border-radius: 10px;
`;

export default ProgressBar;
