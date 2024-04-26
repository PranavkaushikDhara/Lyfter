import React, { useState } from 'react';
import styled from 'styled-components';
import loginImg from '../assets/login.webp';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user'); // Default value is 'user'
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('user Type:', userType);
  };

  return (
    <LoginPageContainer>
      <BackgroundImage src={loginImg} />
      <BlurOverlay />
      <LoginFormContainer>
        <h2>Welcome Back!</h2>
        <LoginForm onSubmit={handleSubmit}>
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
          <UserTypeSelect
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="driver">Driver</option>
          </UserTypeSelect>
          <SubmitButton type="submit">Login</SubmitButton>
        </LoginForm>
        <p>New here? <Link to="/signup">Signup</Link></p>
      </LoginFormContainer>
    </LoginPageContainer>
  );
};

// Styled Components

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
const LoginPageContainer = styled.div`
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

const LoginFormContainer = styled.div`
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const LoginForm = styled.form`
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

export default LoginPage;
