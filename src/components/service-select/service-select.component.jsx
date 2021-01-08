import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row, Select } from 'antd';

import http from '../../http';

const ServiceSelect = ({ typeId, serviceId, onChange }) => {
  const [types, setTypes] = useState([]);
  const [details, setDetails] = useState([]);

  const loadTypes = useCallback(() => {
    return http.get('/service-types').then(({ data }) => {
      setTypes(data);
    });
  }, []);

  const typeChangedHandler = (typeId) => {
    http.post(`/service-type-details`, [typeId]).then(({ data }) => {
      setDetails(data);
    });
  };

  useEffect(() => {
    loadTypes().then(() => {
      if (typeId) {
        typeChangedHandler(typeId);
      }
    });
  }, [loadTypes, typeId]);

  return (
    <Row gutter={8}>
      <Col flex="1">
        <Select
          defaultValue={typeId}
          onChange={typeChangedHandler}
          options={types.map(({ id, name }) => ({ label: name, value: id }))}
        />
      </Col>
      <Col flex="1">
        <Select
          onChange={onChange}
          defaultValue={serviceId}
          options={details.map(({ id, sectionName }) => ({
            label: sectionName,
            value: id,
          }))}
        />
      </Col>
    </Row>
  );
};

export default ServiceSelect;
