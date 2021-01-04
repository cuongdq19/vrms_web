import React, { useCallback, useEffect, useState } from 'react';
import { Cascader } from 'antd';

import http from '../../http';

const ServiceCascader = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);

  const loadOptions = useCallback(() => {
    http.get('/service-types').then(({ data }) => {
      const options = data.map(({ id, name }) => ({
        label: name,
        value: id,
        isLeaf: false,
      }));
      setOptions(options);
    });
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  return (
    <Cascader
      value={value}
      onChange={onChange}
      placeholder="Service Type"
      options={options}
      loadData={(selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];

        targetOption.loading = true;

        http
          .post(`/service-type-details`, [targetOption.value])
          .then(({ data }) => {
            targetOption.loading = false;
            targetOption.children = data.map((detail) => ({
              label: detail.sectionName,
              value: detail.id,
            }));

            setOptions([...options]);
          });
      }}
    />
  );
};

export default ServiceCascader;
