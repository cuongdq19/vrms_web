import React, { useEffect } from 'react';
import { Button, Form, Input, Radio, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import { gender, providerRoles, roles } from '../../utils/constants';
import CustomModal from '../custom-modal/custom-modal.component';
import {
  createUserStart,
  updateUserStart,
} from '../../redux/user/user.actions';
import { withRouter } from 'react-router-dom';

const UserModal = ({
  match,
  user,
  visible,
  title,
  error,
  onCancel,
  onCreateUser,
  onUpdateUser,
}) => {
  const pathname = match.path;
  const roleName = pathname.toUpperCase().includes(roles.Staff)
    ? roles.Staff
    : roles.Technician;
  const [form] = Form.useForm();

  const submitHandler = (values) => {
    if (!values.id) {
      onCreateUser(values);
    } else {
      onUpdateUser(values);
    }
    if (!error) {
      form.resetFields();
    }
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        id: user.id,
        username: user.username,
        password: user.password,
        fullName: user.fullName,
        roleName: user.roleName,
        gender: user.gender,
      });
    }
  }, [form, user, visible]);

  return (
    <CustomModal
      title={title}
      visible={visible}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form form={form} layout="vertical" onFinish={submitHandler}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        {roleName === roles.Staff && (
          <Form.Item
            name="username"
            label="Username"
            rules={[{ message: "Username can't be blank!", required: true }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
        )}
        {roleName === roles.Staff && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ message: "Password can't be blank!", required: true }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}
        {roleName === roles.Staff && (
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: "Password can't be blank." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'The two passwords that you entered do not match!'
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}
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
          initialValue={roleName}
          rules={[{ message: "Role can't be blank!", required: true }]}
        >
          <Radio.Group>
            {Object.keys(providerRoles).map((key) => (
              <Radio key={providerRoles[key]} value={providerRoles[key]}>
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
            {Object.keys(gender).map((key) => (
              <Radio key={key} value={gender[key]}>
                {key}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        {!user && (
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
        )}
      </Form>
    </CustomModal>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
  error: state.users.error,
});

const mapDispatchToProps = (dispatch) => ({
  onCreateUser: (newUser) => dispatch(createUserStart(newUser)),
  onUpdateUser: (updatedUser) => dispatch(updateUserStart(updatedUser)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserModal)
);
