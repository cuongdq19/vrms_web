import { Spin } from 'antd';
import React from 'react';

import { Container } from './loading-spinner.styles';

const LoadingSpinner = ({ title }) => {
  return (
    <Container>
      <Spin size="large" />
      <span>{title}</span>
    </Container>
  );
};

export default LoadingSpinner;
