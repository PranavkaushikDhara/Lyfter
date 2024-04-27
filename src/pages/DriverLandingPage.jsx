import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import RideCard from './RideCard'; // Assuming there's a RideCard component to display each ride
import RideCard from '../components/RideCard';

const DriverLandingPage = () => {
  const [rides, setRides] = useState([]);

  // Fetch available rides when the component mounts
  useEffect(() => {
    fetchAvailableRides();
  }, []);

  // Function to fetch available rides
  const fetchAvailableRides = async () => {
    try {
      // Fetch rides data from the server
      const response = await fetch('http://localhost:8000/getAllRides');
      const data = await response.json();
      console.log(data);
      setRides(data);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  // Function to handle ride acceptance
  const handleAcceptRide = async (rideId) => {
    // try {
    //   // Call the API function to accept the ride
    //   await acceptRide(rideId);
    //   // Update the list of rides after accepting
    //   fetchAvailableRides();
    // } catch (error) {
    //   console.error('Error accepting ride:', error);
    // }
  };

  return (
    <Container>
      <Header>Available Rides</Header>
      {rides.length === 0 ? (
        <NoRidesMessage>No rides available</NoRidesMessage>
      ) : (
        <RideList>
          {rides.map((ride,index) => (
            <RideCard
              key={index}
              ride={ride}
              onAccept={() => {handleAcceptRide(ride.id)}}
            />
          ))}
        </RideList>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.h1`
  margin-bottom: 20px;
`;

const NoRidesMessage = styled.p`
  font-style: italic;
`;

const RideList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

export default DriverLandingPage;
