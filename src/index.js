import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import Home from './pages/Home';
import Test from './pages/Test';
import Header from './components/Header';
import Map from './pages/Map';
import Loading from './components/Loading';
import DriverLandingPage from './pages/DriverLandingPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <Router>
    <Header></Header>
    <Routes>
    <Route path="/" element={<App></App>} />
    <Route path="/login" element={<Login></Login>} />
    <Route path="/signup" element={<RegistrationPage></RegistrationPage>} />
    <Route path="/test" element={<Test></Test>} />
    <Route path="/home" element={<Home></Home>} />
    <Route path="/map" element={<Map></Map>} />
    <Route path="/loading" element={<Loading></Loading>} />
    <Route path='/driverHome' element={<DriverLandingPage></DriverLandingPage>}/>
    </Routes>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
