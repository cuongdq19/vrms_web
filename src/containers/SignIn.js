import React from 'react';
import { Button, Form, Input, Layout, Typography } from 'antd';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

import * as actions from '../store/actions';
import { Redirect } from 'react-router-dom';

const StyledForm = styled(Form)`
  width: 25rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
`;

const StyledContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aliceblue;
`;

const StyledTitle = styled(Typography.Text)`
  align-self: center;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  align-self: center;
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  width: 30%;
  align-self: center;
  margin-top: 1rem;
`;

const StyledFooterContainer = styled.div`
  position: absolute;
  bottom: 20px;
`;

const StyledFooter = styled(Layout.Footer)`
  background-color: transparent;
`;

const SignIn = ({ loading, onSignIn, userData }) => {
  const submitHandler = (formValues) => {
    const { username, password } = formValues;
    onSignIn(username, password);
  };

  if (userData) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <StyledContainer>
      <StyledForm onFinish={submitHandler}>
        <StyledIcon icon={faCar} size="4x" />
        <StyledTitle>Vehicle Repairing And Maintaining Website</StyledTitle>
        <StyledForm.Item name="username">
          <Input
            placeholder="Username"
            prefix={<FontAwesomeIcon icon={faUser} />}
          />
        </StyledForm.Item>
        <StyledForm.Item name="password">
          <Input.Password
            placeholder="Password"
            prefix={<FontAwesomeIcon icon={faLock} />}
          />
        </StyledForm.Item>
        <StyledButton loading={loading} type="primary" htmlType="submit">
          Login
        </StyledButton>
      </StyledForm>
      <StyledFooterContainer>
        <StyledFooter>VRMS ©2020 Created By FPT Students</StyledFooter>
      </StyledFooterContainer>
    </StyledContainer>
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
