import React from 'react'
import styled from 'styled-components'

const Header = () => {
  return (
    <Container>
        <Element>
            Lyfter
        </Element>

        <Element>
            Logout
        </Element>
    </Container>
  )
}


const Container=styled.div`
display: flex;
background-color: #000000;
color: #ffffff;
justify-content: space-between;
height: 30px;
align-items: center;
font-weight: bold;
`;

const Element=styled.div`
display: flex;
padding: 1rem;
font-size: 20px;
`;
export default Header