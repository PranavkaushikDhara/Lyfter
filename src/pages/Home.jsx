import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import ride from '../assets/ride.webp';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
const Home = () => {
    const [startLocation, setStartLocation] = useState("")
    const [destLocation, setDestLocation] = useState("")

    const handleSubmit = async(e) => {
      e.preventDefault();
      const response=await fetch("http://localhost:8000/getLocationCoordinates",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start:startLocation,dest:destLocation
        }),
      })
      
      console.log(await response.json())
  };

    return (
            <Container>
                <Outer>
                    <Text>Go anywhere with Lyfter</Text>
                    <Form onSubmit={handleSubmit}>
                        <FormTitle>Book a Ride</FormTitle>
                        <FormGroup>
                          <GooglePlacesAutocomplete
                            apiKey='AIzaSyCqCLH7DZCPhh9LSJhERje4yuOomqNMsEE'
                            selectProps={{
                              startLocation: startLocation.label,
                              onChange: (value) => setStartLocation(value.label),
                            }}
                          />
                        </FormGroup>
                        <FormGroup>
                        <GooglePlacesAutocomplete
                            apiKey='AIzaSyCqCLH7DZCPhh9LSJhERje4yuOomqNMsEE'
                            selectProps={{
                              destLocation: destLocation.label,
                              onChange: (value) => {setDestLocation(value.label)},
                            }}
                          />
                        </FormGroup>
                        <SubmitButton type="submit">Book Now</SubmitButton>
                    </Form>
                </Outer>
                <Image src={ride} alt="Ride" />
            </Container>

    );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 20px;
  background-color: #000000;
  height: 100vh;
`;

const Outer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.p`
  color: #ffffff; /* White text color */
  font-size: 30px;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  width: 80%; /* Adjust the width as needed */
  padding: 20px;
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  width: 30%;
  padding: 10px;
  background-color: #ffffff;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: grey;
  }
`;

const Image = styled.img`
  @media only screen and (max-width: 768px) {
    display: none;
  }
  
  width: 50%;
  max-width: 600px; /* Adjust the maximum width as needed */
  height: 100vh;
  object-fit: contain; /* Preserve aspect ratio while fitting the image within the container */
  flex-shrink: 0; /* Prevent the image from shrinking beyond its intrinsic width */
`;


export default Home;
