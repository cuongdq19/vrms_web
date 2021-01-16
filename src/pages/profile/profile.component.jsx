import React from 'react';
import { Button, Form, Input, Radio } from 'antd';
import { connect } from 'react-redux';

import { Container, FormContainer } from './profile.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';

const ProfilePage = ({ userData }) => {
  const [form] = Form.useForm();

  return (
    <LayoutWrapper>
      <Container>
        <h1>Update Profile</h1>
        <FormContainer>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              fullName: userData.fullName,
              gender: userData.gender,
            }}
          >
            {/* <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Username can't be blank." }]}
            >
              <Input />
            </Form.Item> */}
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Fullname can't be blank." }]}
            >
              <Input />
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
                <Button type="primary" onClick={() => form.submit()}>
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
  userData: state.auth.userData,
});

export default connect(mapStateToProps)(ProfilePage);
