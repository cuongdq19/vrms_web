import { Col, Row, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import http from '../../http';
import { modelToString, nonAccentVietnamese } from '../../utils';

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
          showSearch
          allowClear
          filterOption={(input, option) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
          onClear={loadData}
          disabled={disabled}
          placeholder="Select Manufacturer"
          options={manuOptions}
          onSelect={(value) => {
            http.get(`/models/manufacturers/${value}`).then(({ data }) => {
              setModelOptions(transformModelsDataToOptions(data));
            });
          }}
        />
      </Col>
      <Col span={16}>
        <Select
          showSearch
          filterOption={(input, option) => {
            return (
              nonAccentVietnamese(option.label)
                .toLowerCase()
                .indexOf(nonAccentVietnamese(input.toLowerCase())) >= 0
            );
          }}
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
