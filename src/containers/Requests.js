import { Table, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

import RequestCreateButton from '../components/RequestCreateButton';
import LayoutWrapper from '../hoc/LayoutWrapper';
import http from '../http';
import RequestCheckInButton from '../components/RequestCheckInButton';

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Requests = () => {
  const [requestData, setRequestData] = useState([]);
  const providerId = useSelector((state) => state.auth.userData.providerId);

  const columns = [
    { title: 'ID', dataIndex: 'id', align: 'center' },
    {
      title: 'User Full Name',
      dataIndex: ['user', 'fullName'],
      align: 'center',
    },
    {
      title: 'Phone Number',
      dataIndex: ['user', 'phoneNumber'],
      align: 'center',
    },
    {
      align: 'center',
      title: 'Booking Time',
      dataIndex: 'bookingTime',
      render: (value) => moment.unix(value).format('DD/MM/YYYY HH:mm'),
    },
    { title: 'Status', dataIndex: 'status', align: 'center' },
    {
      align: 'center',
      title: 'Total Price',
      render: (_, record) => {
        const { parts, services } = record;
        const partsPrice = parts.reduce((curr, part) => {
          return curr + part.price;
        }, 0);
        const servicesPrice = services.reduce((curr, service) => {
          const {
            servicePrice,
            part: { price: partPrice },
          } = service;
          return curr + servicePrice + partPrice;
        }, 0);
        return partsPrice + servicesPrice;
      },
    },
    {
      align: 'center',
      title: 'Check in',
      render: (_, record) => (
        <RequestCheckInButton request={record} onSuccess={fetchRequestsData}>
          Check in
        </RequestCheckInButton>
      ),
    },
  ];

  const fetchRequestsData = useCallback(() => {
    return http
      .get(`/requests/providers/${providerId}`)
      .then(({ data }) => setRequestData(data))
      .catch((err) => console.log(err));
  }, [providerId]);

  useEffect(() => {
    fetchRequestsData();
  }, [fetchRequestsData]);

  return (
    <LayoutWrapper>
      <Header>
        <Typography.Title level={4}>Requests</Typography.Title>
        <RequestCreateButton>Create Request</RequestCreateButton>
      </Header>
      <Table dataSource={requestData} columns={columns} rowKey="id" />
    </LayoutWrapper>
  );
};

export default Requests;
