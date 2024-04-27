import React from 'react';
import styled from 'styled-components';
import { SpinnerCircularFixed } from 'spinners-react';
import ProgressBar from './ProgressBar'; // Import the ProgressBar component

const Loading = () => {
  return (
    <Container>
      <Message>Waiting for driver to confirm your ride..</Message>
      <SpinnerContainer>
        <SpinnerCircularFixed size={32} thickness={180} speed={180} color="#276EF1" secondaryColor="#EEEEEE" />
      </SpinnerContainer>
      <ProgressBarContainer>
        <MovingProgressBar />
      </ProgressBarContainer>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const Message = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`;

const SpinnerContainer = styled.div`
  margin-bottom: 20px;
`;

const ProgressBarContainer = styled.div`
  width: 200px; /* Adjust width as needed */
  margin: 0 auto;
`;

const MovingProgressBar = styled.div`
  height: 10px;
  width: 0%;
  background-color: #276EF1;
  animation: moveProgress 2s linear infinite;
  
  @keyframes moveProgress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
`;

export default Loading;
