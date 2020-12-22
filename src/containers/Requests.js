import { Table, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

import RequestCreateButton from '../components/RequestCreateButton';
import LayoutWrapper from '../hoc/LayoutWrapper';
import http from '../http';
import RequestCheckInButton from '../components/RequestCheckInButton';
import RequestConfirmButton from '../components/RequestConfirmButton';
import { calculateTotalPrice } from '../utils';
import RequestCompleteWorkButton from '../components/RequestCompleteWorkButton';

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
        return calculateTotalPrice(record);
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
    {
      align: 'center',
      title: 'Confirm',
      render: (_, record) => (
        <RequestConfirmButton
          request={{ ...record, totalPrice: calculateTotalPrice(record) }}
          onSuccess={fetchRequestsData}
        >
          Confirm
        </RequestConfirmButton>
      ),
    },
    {
      align: 'center',
      title: 'Completed',
      render: (_, record) => (
        <RequestCompleteWorkButton id={record.id} onSuccess={fetchRequestsData}>
          Completed
        </RequestCompleteWorkButton>
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
