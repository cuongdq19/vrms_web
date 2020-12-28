import { Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

import LayoutWrapper from '../hoc/LayoutWrapper';
import RequestCreateButton from '../components/RequestCreateButton';
import RequestCheckInButton from '../components/RequestCheckInButton';
import RequestConfirmButton from '../components/RequestConfirmButton';
import RequestCompleteWorkButton from '../components/RequestCompleteWorkButton';
import RequestCheckoutButton from '../components/RequestCheckoutButton';
import RequestCanceledButton from '../components/RequestCanceledButton';
import RequestUpdateButton from '../components/RequestUpdateButton';
import http from '../http';
import * as actions from '../store/actions';
import {
  calculateRequestPrice,
  formatMoney,
  generateRequestStatusColor,
} from '../utils';

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Requests = () => {
  const [requestsData, setRequestsData] = useState([]);
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const dispatch = useDispatch();

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
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (value) => {
        const color = generateRequestStatusColor(value);
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      align: 'center',
      title: 'Total Price',
      render: (_, record) => {
        const price = calculateRequestPrice(record);
        return formatMoney(price.total);
      },
    },
    {
      align: 'center',
      title: 'Update',
      render: (_, record) => (
        <RequestUpdateButton
          requestData={record}
          onInitUpdate={() => dispatch(actions.initUpdateRequest(record))}
        >
          Update
        </RequestUpdateButton>
      ),
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
          request={{ ...record, price: calculateRequestPrice(record) }}
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
    {
      align: 'center',
      title: 'Checkout',
      render: (_, record) => (
        <RequestCheckoutButton
          request={{ ...record, price: calculateRequestPrice(record) }}
          onSuccess={fetchRequestsData}
        >
          Checkout
        </RequestCheckoutButton>
      ),
    },
    {
      align: 'center',
      title: 'Canceled',
      render: (_, record) => (
        <RequestCanceledButton id={record.id} onSuccess={fetchRequestsData}>
          Canceled
        </RequestCanceledButton>
      ),
    },
  ];

  const fetchRequestsData = useCallback(() => {
    http
      .get(`/requests/providers/${providerId}`)
      .then(({ data }) => {
        setRequestsData(data);
      })
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
      <Table dataSource={requestsData} columns={columns} rowKey="id" />
    </LayoutWrapper>
  );
};

export default Requests;
