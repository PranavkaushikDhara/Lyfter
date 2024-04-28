import styled from 'styled-components'
import Login from './pages/Login';
import Home from './pages/Home';
import DriverLandingPage from './pages/DriverLandingPage';

function App() {
  return (
    <Container>
      {
        localStorage.getItem("type") === 'user' ?
          <Home />
          :
          <DriverLandingPage></DriverLandingPage>

      }


    </Container>
  );
}
const Container = styled.div`
width: 100%;
`;
export default App;
