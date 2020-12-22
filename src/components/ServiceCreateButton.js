import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import http from '../http';

const { Option } = Select;

const ServiceCreateButton = ({ children, onSuccess }) => {
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTypeDetails, setServiceTypeDetails] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const serviceTypeChangedHandler = (typeId) => {
    http
      .post('/service-type-details', [typeId])
      .then(({ data }) => setServiceTypeDetails(data));
  };

  const manufacturerChangedHandler = (manuId) => {
    http
      .get(`/models/manufacturers/${manuId}`)
      .then(({ data }) => setModels(data));
  };

  const submitHandler = (values) => {
    const { typeDetailId, modelIds, name, price } = values;
    const reqBody = {
      typeDetailId,
      groupPriceRequest: {
        modelIds,
        name,
        price,
      },
    };
    http
      .post(`/services/providers/${providerId}`, reqBody)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSelections = useCallback(() => {
    if (visible) {
      http
        .get('/service-types')
        .then(({ data }) => {
          setServiceTypes(data);
          return http.get('/manufacturers');
        })
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
      <Button icon={<PlusOutlined />} onClick={clickedHandler}>
        {children}
      </Button>
      <Modal
        width="70%"
        maskClosable={false}
        onOk={() => form.submit()}
        visible={visible}
        onCancel={closedHandler}
        title="Create Service"
      >
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Row gutter={8}>
            <Col span={10}>
              <Form.Item label="Service Type">
                <Select onChange={serviceTypeChangedHandler}>
                  {serviceTypes.map((st) => (
                    <Option key={st.id} value={st.id}>
                      {st.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="typeDetailId" label="Section Name">
                <Select disabled={serviceTypeDetails.length === 0}>
                  {serviceTypeDetails.map((std) => (
                    <Option key={std.id} value={std.id}>
                      {std.sectionName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
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

export default ServiceCreateButton;
