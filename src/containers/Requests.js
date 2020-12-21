import { Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

import RequestCreateButton from '../components/RequestCreateButton';
import LayoutWrapper from '../hoc/LayoutWrapper';

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Requests = () => {
  return (
    <LayoutWrapper>
      <Header>
        <Typography.Title level={4}>Requests</Typography.Title>
        <RequestCreateButton>Create Request</RequestCreateButton>
      </Header>
    </LayoutWrapper>
  );
};

export default Requests;
