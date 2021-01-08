import React from 'react';
import { Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import {
  CustomButton,
  Container,
  Footer,
  CustomForm,
  Icon,
  Title,
  RegisterLink,
} from './sign-in.styles';
import * as actions from '../../store/actions';
import Background from '../../assets/images/sign-in-background.png';

const SignIn = ({ loading, signIn, currentUser }) => {
  const submitHandler = (values) => {
    const { username, password } = values;
    signIn(username, password);
  };

  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Container backgroundImage={Background}>
      <CustomForm onFinish={submitHandler}>
        <Icon icon={faCar} size="4x" />
        <Title>Vehicle Repairing And Maintaining Website</Title>
        <CustomForm.Item
          name="username"
          rules={[{ required: true, message: "Username can't be blank" }]}
        >
          <Input
            size="large"
            placeholder="Username"
            prefix={<FontAwesomeIcon icon={faUser} />}
          />
        </CustomForm.Item>
        <CustomForm.Item
          name="password"
          rules={[{ required: true, message: "Password can't be blank" }]}
        >
          <Input.Password
            size="large"
            placeholder="Password"
            prefix={<FontAwesomeIcon icon={faLock} />}
          />
        </CustomForm.Item>
        <CustomButton
          size="large"
          loading={loading}
          type="primary"
          htmlType="submit"
        >
          Login
        </CustomButton>
        <RegisterLink>
          Want to be our partner? <Link to="/sign-up">Click here</Link>
        </RegisterLink>
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
