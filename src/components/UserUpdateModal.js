import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, Upload } from 'antd';
import React from 'react';

import { Gender, ProviderRoles } from '../utils/constants';

const UserUpdateModal = ({ form, updating, onCancel, onSubmit }) => {
  return (
    <Modal
      visible={updating.visible}
      title="Update User"
      maskClosable={false}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={updating.user}
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
          rules={[{ message: "Role can't be blank!", required: true }]}
        >
          <Radio.Group>
            {Object.keys(ProviderRoles).map((key) => (
              <Radio key={key} value={ProviderRoles[key]}>
                {key}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ message: "Gender can't be blank!", required: true }]}
        >
          <Radio.Group>
            {Object.keys(Gender).map((key) => (
              <Radio key={key} value={Gender[key]}>
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
  );
};

export default UserUpdateModal;
