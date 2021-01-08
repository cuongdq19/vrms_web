import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useCallback, useRef, useState } from 'react';
import { Select } from 'antd';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

const MapSearchInput = ({ panTo, onSearch }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: {
        lat: () => 10.8657986,
        lng: () => 106.8030719,
      },
      radius: 200 * 1000,
    },
  });

  return (
    <Select
      width="100%"
      disabled={!ready}
      placeholder="Enter address"
      showSearch
      value={value}
      onSearch={(value) => {
        setValue(value);
      }}
      onSelect={async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
          const results = await getGeocode({ address });
          const { lat, lng } = await getLatLng(results[0]);
          onSearch(address, lat, lng);
          panTo({ lat, lng });
        } catch (error) {
          console.log('Error');
        }
      }}
    >
      {status === 'OK' &&
        data.map(({ place_id, description }) => {
          return <Select.Option key={place_id} value={description} />;
        })}
    </Select>
  );
};

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '540px',
};

const center = {
  lat: 10.8657986,
  lng: 106.8030719,
};

const CustomMap = ({ onSearch }) => {
  const [marker, setMarker] = useState(center);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    setMarker({ lat, lng });
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
      >
        {marker ? (
          <>
            <Marker position={{ lat: marker.lat, lng: marker.lng }} />
          </>
        ) : null}
      </GoogleMap>
    </>
  );
};

export default CustomMap;
