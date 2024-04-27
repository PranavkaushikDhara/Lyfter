import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { mapStyle } from '../mapStyles';
import { useLocation } from 'react-router-dom';
import startImg from '../assets/start.png'
import currentLocationImg from '../assets/currentLocation.png'
import destImage from '../assets/destImage.png'
function Test() {
  const location = useLocation();
  const places = location.state;
  console.log(places)
  const position = { lat: 41.892, lng: -87.6416 };
  return (
    <div style={{ height: "100vh" }}>
      <APIProvider apiKey='AIzaSyCqCLH7DZCPhh9LSJhERje4yuOomqNMsEE'>
        <Map center={position} zoom={10} fullscreenControl={false} styles={mapStyle}>
        <Marker
      position={position}
      clickable={false}
      options  = {{
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





export default Test;
