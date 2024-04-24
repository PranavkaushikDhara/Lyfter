import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const Component = () => {
  const [value, setValue] = useState(null);

  return (
    <div>
      <GooglePlacesAutocomplete

      apiKey='AIzaSyCqCLH7DZCPhh9LSJhERje4yuOomqNMsEE'
        selectProps={{
          value,
          onChange: setValue,
        }}
      />
    </div>
  );
}

export default Component;