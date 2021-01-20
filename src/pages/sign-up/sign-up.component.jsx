import React, { useState } from 'react';
import {
  faCar,
  faFileUpload,
  faMailBulk,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Input, message, Upload } from 'antd';
import { Link, Redirect } from 'react-router-dom';

import {
  CustomButton,
  Container,
  Footer,
  CustomForm,
  Icon,
  Title,
  SignInLink,
} from './sign-up.styles';
import Background from '../../assets/images/sign-up-background.png';
import http from '../../http';

import CustomMap from '../../components/custom-map/custom-map.component';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [redirect, setRedirect] = useState(false);

  const submitHandler = (values) => {
    setLoading(true);
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
        setLoading(false);
        message.success('Request success. We will contact you ASAP.');
        setRedirect(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (redirect) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <Container backgroundImage={Background}>
      <CustomForm form={form} onFinish={submitHandler} labelCol={{ span: 3 }}>
        <Icon icon={faCar} size="4x" />
        <Title>Vehicle Repairing And Maintaining Website</Title>
        <Title>Register as our partner</Title>
        <CustomForm.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Username can't be blank" }]}
        >
          <Input
            placeholder="Full Name"
            prefix={<FontAwesomeIcon icon={faUser} />}
          />
        </CustomForm.Item>
        <CustomForm.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Password can't be blank" }]}
        >
          <Input
            placeholder="Email"
            prefix={<FontAwesomeIcon icon={faMailBulk} />}
          />
        </CustomForm.Item>
        <CustomForm.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: "Phone can't be blank" }]}
        >
          <Input
            type="number"
            placeholder="Phone Number"
            prefix={<FontAwesomeIcon icon={faPhone} />}
          />
        </CustomForm.Item>
        <CustomForm.Item
          label="Facility Images"
          name="images"
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
                  style={{ marginRight: '8px' }}
                />
              }
            >
              Upload
            </Button>
          </Upload>
        </CustomForm.Item>
        <CustomForm.Item name="address" label="Address">
          <CustomMap onSearch={(address) => form.setFieldsValue({ address })} />
        </CustomForm.Item>
        <CustomButton type="primary" loading={loading} htmlType="submit">
          Register
        </CustomButton>
        <SignInLink>
          Already have an account? <Link to="/sign-in">Sign in here</Link>
        </SignInLink>
      </CustomForm>
      <Footer>VRMS ©2020 Created By FPT Students</Footer>
    </Container>
  );
};

export default SignUp;
