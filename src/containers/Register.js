import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  TimePicker,
  Typography,
  Upload,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import http from '../http';
import CustomMap from '../components/CustomMap';

const Container = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 50%;
  padding: 0.75rem;
  background-color: lightblue;
`;

const { Option } = Select;

const Register = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [form] = Form.useForm();
  const submitHandler = () => {};
  const fetchSelections = useCallback(() => {
    http.get('/manufacturers').then(({ data }) => {
      setManufacturers(data);
    });
  }, []);

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  return (
    <Container>
      <FormContainer>
        <div style={{ textAlign: 'center' }}>
          <Typography.Title level={4}>
            Register as New Provider
          </Typography.Title>
        </div>
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Typography.Title level={4}>Contact</Typography.Title>
          <Form.Item label="Full Name" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Phone Number" name="phoneNumber">
            <Input />
          </Form.Item>
          <Typography.Title level={4}>Provider</Typography.Title>
          <Form.Item label="Name" name="providerName">
            <Input />
          </Form.Item>
          <Form.Item label="Manufacturer" name="manufacturerId">
            <Select>
              {manufacturers.map((m) => (
                <Option key={m.id} value={m.id}>
                  {m.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Working Time" name="workingTime">
            <TimePicker.RangePicker
              style={{ width: '100%' }}
              hourStep={1}
              minuteStep={15}
              format="HH:mm"
            />
          </Form.Item>
          <Form.Item label="Slot Duration (minutes)" name="slotDuration">
            <TimePicker
              style={{ width: '100%' }}
              showNow={false}
              hourStep={1}
              minuteStep={5}
              format="HH:mm"
            />
          </Form.Item>
          <Form.Item label="Slot Capacity" name="slotCapacity">
            <InputNumber type="number" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="images"
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              console.log('Upload event:', e);
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload name="logo" beforeUpload={() => false} listType="picture">
              <Button
                icon={
                  <FontAwesomeIcon
                    icon={faFileUpload}
                    style={{ marginRight: 10 }}
                  />
                }
              >
                Click to upload
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="latitude" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="longitude" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <CustomMap
              onSearch={(address, latitude, longitude) =>
                form.setFieldsValue({ address, latitude, longitude })
              }
            />
          </Form.Item>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default Register;
