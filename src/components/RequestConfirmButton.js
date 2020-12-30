import { Button, Col, message, Modal, Row, Table, Typography } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { formatMoney } from '../utils';
import * as actions from '../store/actions';

const generateRowContent = (title, value) => {
  return (
    <>
      <Col span={6}>
        <Typography.Text>{title}: </Typography.Text>
      </Col>
      <Col span={18}>
        <Typography.Title level={5}>{value}</Typography.Title>
      </Col>
    </>
  );
};

const partColumns = [
  {
    title: 'ID',
    dataIndex: 'partId',
    align: 'center',
  },
  {
    title: 'Name',
    dataIndex: 'partName',
    align: 'center',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    render: (value) => formatMoney(value),
    align: 'center',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    align: 'center',
  },
  {
    title: 'Total Price',
    render: (_, record) => formatMoney(record.price * record.quantity),
    align: 'center',
  },
];

const RequestConfirmButton = ({ children, request }) => {
  const { user, bookingTime, price, id } = request;
  const services = request.services.filter((ser) => ser.serviceId);
  const expenses = request.services.filter((ser) => !ser.serviceId);
  const title = 'Confirm Request';
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    setVisible(false);
  };

  const submitHandler = () => {
    dispatch(
      actions.confirmRequest(id, () => {
        message.success('Request has been confirmed.');
        closedHandler();
      })
    );
  };

  return (
    <>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        maskClosable={false}
        visible={visible}
        width="70%"
        onCancel={closedHandler}
        onOk={submitHandler}
        title={title}
      >
        <Row align="middle" gutter={8}>
          <Col span={24}>
            <Typography.Title level={4}>Customer</Typography.Title>
          </Col>
          {generateRowContent('Customer Name', user.fullName)}
          {generateRowContent('Customer Phone Number', user.phoneNumber)}
          {generateRowContent(
            'Booking Time',
            moment.unix(bookingTime).format('DD/MM/YYYY HH:mm')
          )}
          <Col span={24}>
            <Typography.Title level={4}>Services</Typography.Title>
          </Col>
          <Col span={24}>
            <Table
              size="small"
              rowKey="serviceId"
              dataSource={services}
              columns={[
                { title: 'ID', dataIndex: 'serviceId', align: 'center' },
                { title: 'Name', dataIndex: 'serviceName', align: 'center' },
                {
                  title: 'Price',
                  dataIndex: 'servicePrice',
                  render: (value) => formatMoney(value),
                  align: 'center',
                },
              ]}
              expandable={{
                rowExpandable: (record) => record.parts.length > 0,
                expandedRowRender: (record) => {
                  const { parts } = record;
                  return (
                    <Table
                      rowKey="partId"
                      size="small"
                      dataSource={parts}
                      columns={partColumns}
                    />
                  );
                },
              }}
            />
          </Col>
          <Col span={24}>
            <Table
              dataSource={expenses}
              size="small"
              rowKey="id"
              columns={[
                { title: 'ID', dataIndex: 'id', align: 'center' },
                { title: 'Name', dataIndex: 'serviceName', align: 'center' },
                {
                  title: 'Price',
                  dataIndex: 'servicePrice',
                  render: (value) => formatMoney(value),
                  align: 'center',
                },
              ]}
              expandable={{
                rowExpandable: (record) => record.parts.length > 0,
                expandedRowRender: (record) => {
                  const { parts } = record;
                  return (
                    <Table
                      rowKey="partId"
                      size="small"
                      dataSource={parts}
                      columns={partColumns}
                    />
                  );
                },
              }}
            />
          </Col>
          <Col span={8} offset={16}>
            <Row align="middle" justify="end" style={{ textAlign: 'right' }}>
              <Col span={8}>
                <Typography.Text>Services:</Typography.Text>
              </Col>
              <Col span={16}>
                <Typography.Title level={5}>
                  {formatMoney(price.services)}
                </Typography.Title>
              </Col>

              <Col span={8}>
                <Typography.Text>Total:</Typography.Text>
              </Col>
              <Col span={16}>
                <Typography.Title level={5}>
                  {formatMoney(price.total)}
                </Typography.Title>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default RequestConfirmButton;
