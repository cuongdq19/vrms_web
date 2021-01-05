import { Col, Row, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import http from '../../http';
import { modelToString } from '../../utils';

const transformModelsDataToOptions = (data) => {
  return data.map((m) => ({
    label: modelToString(m),
    value: m.id,
  }));
};

const ModelsSelect = ({ disabled = false, models = [], onChange }) => {
  const [modelOptions, setModelOptions] = useState([]);
  const [manuOptions, setManuOptions] = useState([]);

  const loadData = useCallback(() => {
    Promise.all([http.get('/manufacturers'), http.get('/models')]).then(
      ([manus, models]) => {
        setManuOptions(manus.data.map((m) => ({ label: m.name, value: m.id })));
        setModelOptions(transformModelsDataToOptions(models.data));
      }
    );
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Select
          disabled={disabled}
          placeholder="Select Manufacturer"
          options={manuOptions}
          onChange={(value) => {
            http.get(`/models/manufacturers/${value}`).then(({ data }) => {
              setModelOptions(transformModelsDataToOptions(data));
            });
          }}
        />
      </Col>
      <Col span={16}>
        <Select
          disabled={disabled}
          value={models}
          allowClear
          placeholder="Add Models"
          mode="multiple"
          options={modelOptions}
          onChange={(value) => onChange(value)}
        />
      </Col>
    </Row>
  );
};

export default ModelsSelect;
