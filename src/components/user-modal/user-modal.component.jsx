import React from 'react';
import { Button, Form, Input, message, Radio, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import { gender, providerRoles } from '../../utils/constants';
import http from '../../http';
import CustomModal from '../custom-modal/custom-modal.component';

const UserModal = ({
  user,
  providerId,
  visible,
  title,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();

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
    if (!values.id) {
      http
        .post(`/users/provider/${providerId}`, formData)
        .then((res) => {
          message.success('Successfully create.');
          form.resetFields();
          onSuccess();
        })
        .catch((err) => console.log(err));
    } else {
      http
        .post(`/users/${values.id}/provider`, formData)
        .then((res) => {
          message.success('Update successfully.');
          form.resetFields();
          onSuccess();
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <CustomModal
      title={title}
      visible={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submitHandler}
        initialValues={{
          id: user?.id,
          username: user?.username,
          password: user?.password,
          fullName: user?.fullName,
          roleName: user?.roleName,
          gender: user?.gender,
        }}
      >
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
    </CustomModal>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});

export default connect(mapStateToProps)(UserModal);
