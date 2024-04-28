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
  const divvySpots = location.state?.divvySpots;
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
  const handleCardButtonClick = async () => {
    const response = await fetch("http://localhost:8000/bookRide", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ userEmail: localStorage.getItem("email"), userName: localStorage.getItem("userName"), start: originalplaces.start, dest: originalplaces.dest, duration: places.duration })
    })

    const responseObj = await response.json()
    navigate("/loading", { state: responseObj.id });

  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {/* Card component */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 999, backgroundColor: "grey", padding: 20, maxWidth: 300 }}>
        <h2>Ride Details</h2>
        <p>Start Location: {originalplaces.start}</p>
        <p>Destination Location: {originalplaces.dest}</p>
        <p>Duration: {places.duration}</p>
        <button style={{ color: "white", backgroundColor: "black" }} onClick={handleCardButtonClick}>Book Ride</button>
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
          <Marker
            position={{ lat: divvySpots.nearestDivvyFromStart.latitude, lng: divvySpots.nearestDivvyFromStart.longitude }}
            icon={{
              url: 'http://maps.gstatic.com/mapfiles/ms2/micons/blue.png',
            }}
          />
          <Marker
            position={{ lat: divvySpots.nearestDivvyFromDestination.latitude, lng: divvySpots.nearestDivvyFromDestination.longitude }}
            icon={{
              url: 'http://maps.gstatic.com/mapfiles/ms2/micons/blue.png',
            }}
          />
          <Directions places={places} divvySpots={divvySpots}></Directions>
        </Map>
      </APIProvider>
    </div>
  );
}

function Directions({ places, divvySpots }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsServices, setDirectionsServices] = useState({});
  const [directionsRenderers, setDirectionsRenderers] = useState({});
  const [originMarker, setOriginMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) {
      return;
    }
    const travelModes = ['DRIVING', 'BICYCLING']; // Add more travel modes as needed
    const services = {};
    const renderers = {};

    travelModes.forEach(mode => {
      services[mode] = new window.google.maps.DirectionsService();
      renderers[mode] = new window.google.maps.DirectionsRenderer({ map });
    });

    setDirectionsServices(services);
    setDirectionsRenderers(renderers);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsServices || !directionsRenderers) return;

    
    const directionsRequests = Object.keys(directionsServices).map(mode => {

      const origin = mode === "BICYCLING" ?
      { lat: divvySpots.nearestDivvyFromStart.latitude, lng: divvySpots.nearestDivvyFromStart.longitude } :
      { lat: places.start.latitude, lng: places.start.longitude };

    const destination = mode === "BICYCLING" ?
      { lat: divvySpots.nearestDivvyFromDestination.latitude, lng: divvySpots.nearestDivvyFromDestination.longitude } :
      { lat: places.dest.latitude, lng: places.dest.longitude };

    const requestTemplate = {
      origin,
      destination,
      travelMode: '',
    };


      const request = { ...requestTemplate, travelMode: mode };
      return { mode, request };
    });

    directionsRequests.forEach(({ mode, request }) => {
      directionsServices[mode].route(request, (result, status) => {
        console.log(status); // Log the status
        if (status === 'OK') {
          console.log(result); // Log the directions object
          directionsRenderers[mode].setDirections(result);
          // Set directions to the DirectionsRenderer
          if (mode === 'BICYCLING') {
            // Set polyline color to a different color for bicycling mode
            directionsRenderers[mode].setOptions({
              polylineOptions: {
                strokeColor: 'green', // Change the color here
              },
            });
          }
        } else {
          console.error('Directions request failed due to ' + status);
        }
      });
    });
  }, [directionsServices, directionsRenderers, places]);

  // Set polyline color to black
  useEffect(() => {
    Object.values(directionsRenderers).forEach(renderer => {
      if (renderer) {
        renderer.setOptions({
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
    });
  }, [directionsRenderers]);

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
