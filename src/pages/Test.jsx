import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

function Test() {
  const position = { lat: 41.892, lng: -87.6416 };
  const markers = [
    { id: 1, position: { lat: 41.9, lng: -87.65 } },
    { id: 2, position: { lat: 41.85, lng: -87.63 } },
    { id: 3, position: { lat: 41.88, lng: -87.67 } }
    // Add more markers as needed
  ];

  function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState(null);

    useEffect(() => {
      if (!routesLibrary || !map) {
        return;
      }
      // Additional setup or logic related to directions service can be added here
    }, [routesLibrary, map]);

    return null;
  }

  return (
    <div style={{ height: "100vh" }}>
      <APIProvider apiKey='AIzaSyCqCLH7DZCPhh9LSJhERje4yuOomqNMsEE'>
        <Map center={position} zoom={10} fullscreenControl={false}>
          {markers.map(marker => (
            <Marker key={marker.id} position={marker.position} />
          ))}
          <Directions />
        </Map>
      </APIProvider>
    </div>
  );
}

export default Test;
