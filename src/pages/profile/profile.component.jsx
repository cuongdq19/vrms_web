import React from 'react';
import { Button, Form, Image, Input, Radio } from 'antd';
import { connect } from 'react-redux';

import { Container, FormContainer } from './profile.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import { updateProfileStart } from '../../redux/auth/auth.actions';

const ProfilePage = ({ userData, onUpdateProfile }) => {
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
              fullName: userData.fullName,
              gender: userData.gender,
            }}
            onFinish={submitHandler}
          >
            <Image src={userData.imgUrl} width="30%" height="30%" />
            <Form.Item name="id" label="User ID">
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

const mapDispatchToProps = (dispatch) => ({
  onUpdateProfile: (userData) => dispatch(updateProfileStart(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
