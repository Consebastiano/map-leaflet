
import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { mapStyles } from './mapStyles';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 35.6804,
  lng: 139.769,
};

const options = {
  styles: mapStyles,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';

  return (
    <div className="App">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        options={options}
      ></GoogleMap>
    </div>
  );
}

export default App;