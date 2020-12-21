import { Table, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ServiceCreateButton from '../components/ServiceCreateButton';
import LayoutWrapper from '../hoc/LayoutWrapper';
import http from '../http';

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Services = () => {
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [services, setServices] = useState([]);
  const fetchServicesData = useCallback(() => {
    http
      .get(`/services/providers/${providerId}`)
      .then(({ data }) => {
        setServices(data);
      })
      .catch((err) => console.log(err));
  }, [providerId]);

  const columns = [
    { title: 'ID', dataIndex: ['typeDetail', 'id'] },
    {
      title: 'Name',
      render: (_, { typeDetail }) =>
        `${typeDetail.typeName} ${typeDetail.sectionName}`,
    },
  ];

  useEffect(() => {
    fetchServicesData();
  }, [fetchServicesData]);
  return (
    <LayoutWrapper>
      <Header>
        <Typography.Title level={4}>Services</Typography.Title>
        <ServiceCreateButton>New Service</ServiceCreateButton>
      </Header>
      <Table
        rowKey={(record) => record.typeDetail.id}
        dataSource={services}
        columns={columns}
      />
    </LayoutWrapper>
  );
};

export default Services;
