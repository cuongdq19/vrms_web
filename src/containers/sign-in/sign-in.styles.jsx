import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Layout, Typography } from 'antd';
import styled from 'styled-components';

export const CustomForm = styled(Form)`
  width: 25rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aliceblue;
`;

export const Title = styled(Typography.Text)`
  align-self: center;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
`;

export const Icon = styled(FontAwesomeIcon)`
  align-self: center;
  margin-bottom: 1rem;
`;

export const CustomButton = styled(Button)`
  width: 30%;
  align-self: center;
  margin-top: 1rem;
`;

export const FooterContainer = styled.div`
  position: absolute;
  bottom: 20px;
`;

export const Footer = styled(Layout.Footer)`
  background-color: transparent;
`;
