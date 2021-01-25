import React, { useEffect } from 'react';
import { Button, Form, Input, Radio, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import { gender, providerRoles } from '../../utils/constants';
import CustomModal from '../custom-modal/custom-modal.component';
import {
  createUserStart,
  updateUserStart,
} from '../../redux/user/user.actions';

const UserModal = ({
  user,
  visible,
  title,
  error,
  onCancel,
  onCreateUser,
  onUpdateUser,
}) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(UserModal);
