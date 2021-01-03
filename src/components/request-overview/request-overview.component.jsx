import { Table } from 'antd';
import React from 'react';
import { formatMoney } from '../../utils';

import { Container } from './request-overview.styles';

const RequestOverview = ({ item }) => {
  const { id, services } = item;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      render: (value, record) => value,
    },
    {
      title: 'Name',
      dataIndex: 'serviceName',
      align: 'center',
      render: (value, record) => value,
    },
    {
      title: 'Price',
      dataIndex: 'servicePrice',
      align: 'center',
      render: (value, record) => formatMoney(value),
    },
  ];
  return (
    <Container>
      <span>Request #{id}</span>
      <Table dataSource={services} columns={columns} rowKey="id" />
    </Container>
  );
};

export default RequestOverview;
