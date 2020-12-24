import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Input, message, Typography, Upload } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import http from '../http';
import CustomMap from '../components/CustomMap';
import { Redirect } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 50%;
  padding: 0.75rem;
  background-color: lightblue;
`;

const FormButtons = styled.div`
  width: 30%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Register = () => {
  const [form] = Form.useForm();
  const [redirect, setRedirect] = useState(null);

  const submitHandler = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      switch (key) {
        case 'images':
          values[key].forEach((img) =>
            formData.append('images', img.originFileObj)
          );
          break;
        default:
          formData.append(key, values[key]);
          break;
      }
    });
    http
      .post('/contracts', formData)
      .then(({ data }) => {
        message.success('Request success. We will contact you ASAP.');
        setRedirect(<Redirect to="/sign-in" />);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      {redirect}
      <FormContainer>
        <div style={{ textAlign: 'center' }}>
          <Typography.Title level={4}>
            Register as New Provider
          </Typography.Title>
        </div>
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Form.Item label="Full Name" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Phone Number" name="phoneNumber">
            <Input />
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
          <Form.Item name="address" label="Address">
            <CustomMap
              onSearch={(address, latitude, longitude) =>
                form.setFieldsValue({ address })
              }
            />
          </Form.Item>
          <FormButtons>
            <Button type="primary" onClick={() => form.submit()}>
              Submit
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </FormButtons>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default Register;
