import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import * as mapStyle from '../assets/maps/style.json';

const center = {
  lat: -25.4951166,
  lng: -49.2897982
};

export interface MapProps {
  markers: MarkerProps[];
  lines: PolylineProps[];
}

export interface MarkerProps {
  id: string;
  iconUrl: string;
  lat: number;
  lng: number;
}

export interface PolylineProps {
  start: { lat: number, lng: number };
  end: { lat: number, lng: number };
  color?: string,
}

const Maps: React.FC<MapProps> = ({ markers, lines }) => {
  const [isGoogleMapsAPILoaded, setIsGoogleMapsAPILoaded] = useState(false)

  return <LoadScript
    googleMapsApiKey="AIzaSyAHvBiL9YuOdkfgaZ1M9CGgMkx5hPEUfmE"
    onLoad={() => {
      setIsGoogleMapsAPILoaded(true)
    }} >
    <GoogleMap mapContainerStyle={{
      width: '100%',
      height: '100%'
    }}
      center={center}
      options={{ styles: mapStyle, zoomControl: false, streetViewControl: false, mapTypeControl: false }}
      streetView={undefined}
      zoom={12}>
      {isGoogleMapsAPILoaded && markers.map((marker, index) => {
        return <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={{
            url: marker.iconUrl,
            scaledSize: new window.google.maps.Size(48, 48)
          }} />
      })}
      {isGoogleMapsAPILoaded && lines.map((line, index) => {
        return <Polyline key={index} path={[{ lat: line.start.lat, lng: line.start.lng }, { lat: line.end.lat, lng: line.end.lng }]}
          options={{
            strokeColor: line.color ?? "#ff2527",
            strokeOpacity: 1,
            strokeWeight: 3,
          }} />;
      })}


    </GoogleMap>
  </LoadScript >;

}

export default Maps;