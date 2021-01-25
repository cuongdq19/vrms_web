import React from 'react';
import { Avatar, Button, Form, Input, Radio } from 'antd';
import { connect } from 'react-redux';

import { Container, FormContainer } from './profile.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import { updateProfileStart } from '../../redux/auth/auth.actions';
import { UserOutlined } from '@ant-design/icons';

const ProfilePage = ({ userData, loading, onUpdateProfile }) => {
  const [form] = Form.useForm();

  const submitHandler = (values) => {
    onUpdateProfile(values);
  };

  return (
    <LayoutWrapper>
      <Container>
        <h1>Update Profile</h1>
        <FormContainer>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: userData.id,
              username: userData.username,
              fullName: userData.fullName,
              gender: userData.gender,
            }}
            onFinish={submitHandler}
          >
            <Avatar
              src={userData.imgUrl[0]}
              icon={<UserOutlined />}
              shape="square"
              size="large"
            />
            <Form.Item hidden name="id" label="User ID">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Username can't be blank." }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Fullname can't be blank." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password can't be blank." }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
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
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Gender can't be blank." }]}
            >
              <Radio.Group>
                <Radio value={true}>Male</Radio>
                <Radio value={false}>Female</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Container>
                <Button
                  loading={loading}
                  type="primary"
                  onClick={() => form.submit()}
                >
                  Submit
                </Button>
              </Container>
            </Form.Item>
          </Form>
        </FormContainer>
      </Container>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  userData: state.auth.userData,
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateProfile: (userData) => dispatch(updateProfileStart(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
