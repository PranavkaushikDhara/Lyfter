import React from 'react';
import styled from 'styled-components';

const RideCard = ({ ride, onAccept }) => {
    console.log(ride._source)
  
    const riderEmail=ride._source.userEmail;
    const riderName=ride._source.userName;
    const startLocation=ride._source.start;
    const destLocation=ride._source.dest;
  return (
    <CardContainer>
      <CardContent>
        <Label>Rider Name:</Label>
        <Value>{riderName}</Value>
      </CardContent>
      <CardContent>
        <Label>Rider Email:</Label>
        <Value>{riderEmail}</Value>
      </CardContent>
      <CardContent>
        <Label>Start Location:</Label>
        <Value>{startLocation}</Value>
      </CardContent>
      <CardContent>
        <Label>Destination Location:</Label>
        <Value>{destLocation}</Value>
      </CardContent>
      <AcceptButton onClick={onAccept}>Accept Ride</AcceptButton>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
`;

const CardContent = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  margin-left: 10px;
`;

const AcceptButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default RideCard;
