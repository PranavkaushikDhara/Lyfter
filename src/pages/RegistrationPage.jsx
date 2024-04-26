import React, { useState } from 'react';
import styled from 'styled-components';
import loginImg from '../assets/login.webp';
import { Link, useNavigate } from 'react-router-dom';
import { type } from '@testing-library/user-event/dist/type';

const RegistrationPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user'); // Default value is 'user'
  const navigate=useNavigate()
  const handleSubmit = async(e) => {
    e.preventDefault();
   
    const response=await fetch("http://localhost:8000/getAllUsers",{
      method:"GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    const users=await response.json();
    const userExists = users.some(user => user._source.email === email);

    if (userExists) {
      alert('User already exists with this email!');
      return;
    }
    await fetch("http://localhost:8000/addUser",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({email:email,name:name,password:password,type:userType})
    })
    localStorage.setItem('users', JSON.stringify(users));
    alert('User signed up, Now please log in');
    navigate('/login');
  };

  return (
    <RegistrationPageContainer>
      <BackgroundImage src={loginImg} />
      <BlurOverlay />
      <RegistrationFormContainer>
        <h2>Join Us!</h2>
        <RegistrationForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Dropdown for User Type */}
          <UserTypeSelect
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="driver">Driver</option>
          </UserTypeSelect>
          <SubmitButton type="submit">Register</SubmitButton>
        </RegistrationForm>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </RegistrationFormContainer>
    </RegistrationPageContainer>
  );
};

// Styled Components (existing ones remain unchanged)

const UserTypeSelect = styled.select`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

  

// Styled Components
const RegistrationPageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const BackgroundImage = styled.img`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const BlurOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px); /* Apply the blur effect */
`;

const RegistrationFormContainer = styled.div`
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const RegistrationForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default RegistrationPage;
