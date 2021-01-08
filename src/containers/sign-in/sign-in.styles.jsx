import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Layout, Typography } from 'antd';
import styled from 'styled-components';

export const CustomForm = styled(Form)`
  width: 25%;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: whitesmoke;
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-image: ${(props) => `url(${props.backgroundImage})`};
`;

export const Title = styled(Typography.Text)`
  align-self: center;
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 20px;
  text-align: center;
`;

export const Icon = styled(FontAwesomeIcon)`
  align-self: center;
`;

export const CustomButton = styled(Button)`
  width: 25%;
  align-self: center;
`;

export const Footer = styled(Layout.Footer)`
  background-color: transparent;
  position: absolute;
  font-size: 20px;
  font-weight: 600;
  color: white;
  bottom: 20px;
`;

export const RegisterLink = styled.span`
  margin-top: 16px;
  align-self: center;
  text-align: center;
  font-size: 16px;
`;
