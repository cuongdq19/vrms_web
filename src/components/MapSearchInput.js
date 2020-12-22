import { Select } from 'antd';
import React from 'react';
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

export default MapSearchInput;
