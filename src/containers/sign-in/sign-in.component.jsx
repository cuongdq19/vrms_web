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
  FooterContainer,
  CustomForm,
  Icon,
  Title,
} from './sign-in.styles';
import * as actions from '../../store/actions';

const SignIn = ({ loading, onSignIn, userData }) => {
  const submitHandler = (formValues) => {
    const { username, password } = formValues;
    onSignIn(username, password);
  };

  if (userData) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Container>
      <CustomForm onFinish={submitHandler}>
        <Icon icon={faCar} size="4x" />
        <Title>Vehicle Repairing And Maintaining Website</Title>
        <CustomForm.Item name="username">
          <Input
            placeholder="Username"
            prefix={<FontAwesomeIcon icon={faUser} />}
          />
        </CustomForm.Item>
        <CustomForm.Item name="password">
          <Input.Password
            placeholder="Password"
            prefix={<FontAwesomeIcon icon={faLock} />}
          />
        </CustomForm.Item>
        <CustomButton loading={loading} type="primary" htmlType="submit">
          Login
        </CustomButton>
      </CustomForm>
      <FooterContainer>
        <Footer>VRMS ©2020 Created By FPT Students</Footer>
      </FooterContainer>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    userData: state.auth.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (username, password) =>
      dispatch(actions.signIn(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
