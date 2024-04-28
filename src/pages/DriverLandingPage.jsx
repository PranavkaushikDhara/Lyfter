import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import RideCard from './RideCard'; // Assuming there's a RideCard component to display each ride
import RideCard from '../components/RideCard';
import { useNavigate } from 'react-router-dom';

const DriverLandingPage = () => {
  const [rides, setRides] = useState([]);
  const navigate=useNavigate()
  const userType=localStorage.getItem("type");
  // Fetch available rides when the component mounts
  useEffect(() => {
    const userType=localStorage.getItem("type");
    if(userType==='user'||!userType){
        navigate("/home");
        alert("Not authenticated ")
    }
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
  const handleAcceptRide = async (ride) => {
    
    const rideId=ride._id
    console.log(rideId)
    const response=await fetch("http://localhost:8000/acceptRide",{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rideId }) // Pass id in the body
    })
    const updatedRides = rides.filter(r => r._id !== rideId); 
    setRides(updatedRides);
    const data=await response.json();
    //Update the rides and refresh the page
   
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
              onAccept={() => {console.log(ride); handleAcceptRide(ride)}}
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
