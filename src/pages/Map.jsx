import React from "react";
import { GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const defaultLocation = { lat: 40.756795, lng: -73.954298 };
const destination = { lat: 41.756795, lng: -78.954298 };
const origin = { lat: 40.756795, lng: -73.954298 };

class Map extends React.Component {
  state = {
    directions: null
  };

  onDirectionsLoad = (directions) => {
    this.setState({ directions });
  };

  render() {
    return (
      <div>
        <GoogleMap
          center={defaultLocation}
          zoom={5}
          mapContainerStyle={{ height: "400px", width: "800px" }}
        >
          {destination && (
            <DirectionsService
              options={{ destination, origin, travelMode: "DRIVING" }}
              callback={this.onDirectionsLoad}
            />
          )}
          {this.state.directions && (
            <DirectionsRenderer directions={this.state.directions} />
          )}
        </GoogleMap>
      </div>
    );
  }
}

export default Map;
