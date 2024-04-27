import styled from 'styled-components'
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Container>
      <Home/>
    </Container>
  );
}
const Container=styled.div`
width: 100%;
`;
export default App;
