import React from 'react';
import { Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  CustomButton,
  Container,
  Footer,
  CustomForm,
  Icon,
  Title,
} from './sign-in.styles';
import * as actions from '../../store/actions';

const SignIn = ({ loading, signIn, currentUser }) => {
  const submitHandler = (values) => {
    const { username, password } = values;
    signIn(username, password);
  };

  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Container>
      <CustomForm onFinish={submitHandler}>
        <Icon icon={faCar} size="4x" />
        <Title>Vehicle Repairing And Maintaining Website</Title>
        <CustomForm.Item
          name="username"
          rules={[{ required: true, message: "Username can't be blank" }]}
        >
          <Input
            placeholder="Username"
            prefix={<FontAwesomeIcon icon={faUser} />}
          />
        </CustomForm.Item>
        <CustomForm.Item
          name="password"
          rules={[{ required: true, message: "Password can't be blank" }]}
        >
          <Input.Password
            placeholder="Password"
            prefix={<FontAwesomeIcon icon={faLock} />}
          />
        </CustomForm.Item>
        <CustomButton loading={loading} type="primary" htmlType="submit">
          Login
        </CustomButton>
      </CustomForm>
      <Footer>VRMS ©2020 Created By FPT Students</Footer>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    currentUser: state.auth.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (username, password) =>
      dispatch(actions.signIn(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
