import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import React, { useCallback, useRef } from 'react';
import MapSearchInput from './MapSearchInput';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '650px',
};

const center = {
  lat: 10.8657986,
  lng: 106.8030719,
};

const CustomMap = ({ onSearch }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18);
  }, []);

  if (loadError) return 'Error Loading Maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <>
      <MapSearchInput panTo={panTo} onSearch={onSearch} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        onLoad={onMapLoad}
      ></GoogleMap>
    </>
  );
};

export default CustomMap;
