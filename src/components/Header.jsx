import React, { useState } from 'react';
import styled from 'styled-components';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("userName"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload()
    setIsLoggedIn(null); // Set logged-in state to null
  };

  return (
    <Container>
      <Element>
        Lyfter
      </Element>

      <Element>
        {isLoggedIn ?
          <button className="logout" onClick={handleLogout}>LogOut</button> :
          <button className="login">LogIn</button>
        }
      </Element>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  background-color: #000000;
  color: #ffffff;
  justify-content: space-between;
  height: 30px;
  align-items: center;
  font-weight: bold;
`;

const Element = styled.div`
  display: flex;
  padding: 1rem;
  font-size: 20px;
`;

export default Header;
