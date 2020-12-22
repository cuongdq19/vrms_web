import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import http from '../http';

const { Option } = Select;

const ServiceUpdateButton = ({ service, onSuccess, children }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const manufacturerChangedHandler = (manuId) => {
    http
      .get(`/models/manufacturers/${manuId}`)
      .then(({ data }) => setModels(data));
  };

  const submitHandler = (values) => {
    const { id, modelIds, name, price } = values;
    http
      .post(`/services/${id}`, { modelIds, name, price })
      .then(({ data }) => {
        message.success('Update service success');
        closedHandler();
        onSuccess();
      })
      .catch((err) => console.log(err));
  };

  const fetchSelections = useCallback(() => {
    if (visible) {
      return http
        .get('/manufacturers')
        .then(({ data }) => {
          setManufacturers(data);
          return http.get('/models');
        })
        .then(({ data }) => setModels(data));
    }
  }, [visible]);

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  return (
    <>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        width="70%"
        maskClosable={false}
        onOk={() => form.submit()}
        visible={visible}
        onCancel={closedHandler}
        title="Create Service"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submitHandler}
          initialValues={service}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Service Name">
            <Input placeholder="Enter service name" />
          </Form.Item>
          <Row gutter={8}>
            <Col span={4}>
              <Form.Item label="Manufacturer">
                <Select onChange={manufacturerChangedHandler}>
                  {manufacturers.map((m) => (
                    <Option key={m.id} value={m.id}>
                      {m.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="Models" name="modelIds">
                <Select mode="multiple">
                  {models.map((model) => (
                    <Option key={model.id} value={model.id}>
                      {model.manufacturerName} {model.name} {model.fuelType}{' '}
                      {model.gearbox} ({model.year})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="price" label="Price">
                <InputNumber style={{ width: '100%' }} type="number" min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceUpdateButton;
