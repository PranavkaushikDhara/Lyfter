import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { mapStyle } from '../mapStyles';
import { useLocation, useNavigate } from 'react-router-dom';
import startImg from '../assets/start.png';
import currentLocationImg from '../assets/currentLocation.png';
import destImage from '../assets/destImage.png';

function LyfterMap() {
  
  const location = useLocation();
  const places = location.state?.places;
  const originalplaces = location.state?.originalLocations;
  const navigate = useNavigate();
  console.log(places)
  // Check if userName key exists in localStorage, if not navigate to /login
  useEffect(() => {
    if (!localStorage.getItem('userName')) {
      navigate('/login');
    }
  }, [navigate]);

  // If places or originalplaces is undefined, return null to prevent errors
  if (!places || !originalplaces) return null;

  // console.log(originalplaces)
  const uiControlOptions = {
    mapTypeControl: false, // Remove the map type control
    fullscreenControl: false, // Keep fullscreen control disabled as in your original code
  };
  const position = { lat: 41.892, lng: -87.6416 };

  // Function to handle the card button click
  const handleCardButtonClick = async() => {
    const response=await fetch("http://localhost:8000/bookRide",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },

      body:JSON.stringify({userEmail:localStorage.getItem("email") ,userName:localStorage.getItem("userName"),start:originalplaces.start,dest:originalplaces.dest,duration:places.duration})
    })
    
    const responseObj=await response.json()
    navigate("/loading",{ state: responseObj.id });
    
  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {/* Card component */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 999, backgroundColor: "grey", padding: 20, maxWidth: 300 }}>
        <h2>Ride Details</h2>
        <p>Start Location: {originalplaces.start}</p>
        <p>Destination Location: {originalplaces.dest}</p>
        <p>Duration: {places.duration}</p>
        <button style={{color:"white",backgroundColor:"black"}} onClick={handleCardButtonClick}>Book Ride</button>
      </div>

      {/* Map component */}
      <APIProvider apiKey='AIzaSyCqCLH7DZCPhh9LSJhERje4yuOomqNMsEE'>
        <Map center={position} zoom={10} fullscreenControl={false} uiControlOptions={uiControlOptions} styles={mapStyle}>
          <Marker
            position={position}
            clickable={false}
            options={{
              icon: {
                url: currentLocationImg,
                scaledSize: new window.google.maps.Size(22, 22),
              },
            }}
          />
          <Directions places={places}></Directions>
        </Map>
      </APIProvider>
    </div>
  );
}

function Directions({ places }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [originMarker, setOriginMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) {
      return;
    }
    setDirectionsService(new window.google.maps.DirectionsService());
    setDirectionsRenderer(new window.google.maps.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    const origin = { lat: places.start.latitude, lng: places.start.longitude }; // Origin coordinates
    const destination = { lat: places.dest.latitude, lng: places.dest.longitude }; // Destination coordinates

    const request = {
      origin,
      destination,
      travelMode: 'DRIVING'
    };

    directionsService.route(request, (result, status) => {
      console.log(status); // Log the status
      if (status === 'OK') {
        console.log(result); // Log the directions object
        directionsRenderer.setDirections(result); // Set directions to the DirectionsRenderer
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }, [directionsService, directionsRenderer]);

  // Set polyline color to black
  useEffect(() => {
    if (directionsRenderer) {
      directionsRenderer.setOptions({
        polylineOptions: {
          clickable: false,
          strokeColor: 'blue',
          strokeWeight: 3,
          strokeOpacity: 1,
          geodesic: false,
        },
        suppressMarkers: true,
      });
    }
  }, [directionsRenderer]);

  return (
    <>
      {places && (
        <>
          <Marker
            position={{ lat: places.start.latitude, lng: places.start.longitude }}
            icon={{
              url: startImg,
              scaledSize: new window.google.maps.Size(32, 32)
            }}
            onLoad={marker => setOriginMarker(marker)}
          />
          <Marker
            position={{ lat: places.dest.latitude, lng: places.dest.longitude }}
            icon={{
              url: destImage,
              scaledSize: new window.google.maps.Size(32, 32)
            }}
            onLoad={marker => setDestinationMarker(marker)}
          />
        </>
      )}
    </>
  );
}

export default LyfterMap;
