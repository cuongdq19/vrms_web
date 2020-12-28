import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, Upload } from 'antd';
import React, { useState } from 'react';

import { gender } from '../utils/constants';
import http from '../http';

const UserUpdateButton = ({ user, onSuccess, children }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const submitHandler = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      switch (key) {
        case 'image':
          values[key].forEach((obj) => formData.append(key, obj.originFileObj));
          break;
        default:
          formData.append(key, values[key]);
      }
    });
    http
      .post(`/users/${values.id}/provider`, formData)
      .then((res) => {
        onSuccess();
        setVisible(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        visible={visible}
        title={children}
        maskClosable={false}
        onOk={() => form.submit()}
        onCancel={closedHandler}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submitHandler}
          initialValues={user}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ message: "Username can't be blank!", required: true }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ message: "Password can't be blank!", required: true }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ message: "Full name can't be blank!", required: true }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="roleName"
            label="Role"
            hidden
            rules={[{ message: "Role can't be blank!", required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ message: "Gender can't be blank!", required: true }]}
          >
            <Radio.Group>
              {Object.keys(gender).map((key) => (
                <Radio key={key} value={gender[key]}>
                  {key}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
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
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserUpdateButton;
