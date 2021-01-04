import { Col, Row, Table } from 'antd';
import React from 'react';

import { calculateRequestPrice, formatMoney } from '../../utils';
import { Summary } from './request-overview.styles';

const RequestOverview = ({ item }) => {
  const { services, user } = item;

  let total = null;

  if (item) {
    total = calculateRequestPrice(item);
  }

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
    <Row gutter={[8, 8]}>
      <Col span={12}>
        <Row align="middle" gutter={[8, 8]}>
          <Col span={24}>
            <h1>Customer Information</h1>
          </Col>
          <Col span={6}>
            <span>Full Name: </span>
          </Col>
          <Col span={18}>
            <h2>{user.fullName}</h2>
          </Col>
          <Col span={6}>
            <span>Phone Number: </span>
          </Col>
          <Col span={18}>
            <h2>{user.phoneNumber}</h2>
          </Col>
        </Row>
      </Col>
      <Col span={12}></Col>
      <Col span={24}>
        <h1>Services</h1>
      </Col>
      <Col span={24}>
        <Table dataSource={services} columns={columns} rowKey="id" />
      </Col>
      <Col span={6} offset={18}>
        <Summary justify="end" align="middle" gutter={[8, 8]}>
          <Col span={6}>
            <span>Services: </span>
          </Col>
          <Col span={18}>
            <h2>{formatMoney(total.services)}</h2>
          </Col>
          <Col span={6}>
            <span>Total: </span>
          </Col>
          <Col span={18}>
            <h2>{formatMoney(total.total)}</h2>
          </Col>
        </Summary>
      </Col>
    </Row>
  );
};

export default RequestOverview;
