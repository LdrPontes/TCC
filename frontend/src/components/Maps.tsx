import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import * as mapStyle from '../assets/maps/style.json';

const center = {
  lat: -25.4951166,
  lng: -49.2897982
};

const Maps: React.FC = () => {
  return <LoadScript googleMapsApiKey="AIzaSyAHvBiL9YuOdkfgaZ1M9CGgMkx5hPEUfmE" >
    <GoogleMap mapContainerStyle={{
      width: '100%',
      height: '100%'
    }}
      center={center}
      options={{ styles: mapStyle, zoomControl: false, streetViewControl: false, mapTypeControl: false }}
      streetView={undefined}
      zoom={12} />
  </LoadScript >;

}

export default Maps;