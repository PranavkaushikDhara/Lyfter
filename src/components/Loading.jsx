import React, { useState } from 'react';
import styled from 'styled-components';
import { SpinnerCircularFixed } from 'spinners-react';
import ProgressBar from './ProgressBar'; // Import the ProgressBar component
import { useLocation, useNavigate } from 'react-router-dom';

const Loading = () => {
  const [rideStatus, setRideStatus] = useState(null);
  const location = useLocation();
  const id = location.state;
    const navigate=useNavigate()
  const fetchRideStatus = async () => {
    try {
      const response = await fetch("http://localhost:8000/getRideStatus", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }) // Pass id in the body
      });

      if (response.ok) {
        const data = await response.json();
        if(data._source.rideStatus==="booked"){
            alert("Ride accepted, Your driver is on the way")
            navigate("/home")
        }
        // setRideStatus(data.status); // Assuming the status is under a 'status' key in the response JSON
      } else {
        throw new Error('Failed to fetch ride status');
      }
    } catch (error) {
      console.error('Error fetching ride status:', error);
    }
  };

  // Call fetchRideStatus whenever needed
  const fetchStatusAgain = () => {
    fetchRideStatus();
  };

  // Example: Call fetchStatusAgain when a button is clicked
  const handleButtonClick = () => {
    fetchStatusAgain();
  };

  return (
    <Container>
      <Message>Waiting for driver to confirm your ride..</Message>
      <SpinnerContainer>
        <SpinnerCircularFixed size={32} thickness={180} speed={180} color="#276EF1" secondaryColor="#EEEEEE" />
      </SpinnerContainer>
      <ProgressBarContainer>
        <MovingProgressBar />
      </ProgressBarContainer>
      <Button onClick={handleButtonClick}>Fetch Status Again</Button>
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

const Button = styled.button`
  background-color: #276EF1;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

export default Loading;
