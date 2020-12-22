import { Button, Col, message, Modal, Row, Table, Typography } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';

import http from '../http';

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

const RequestCheckoutButton = ({ children, request, onSuccess }) => {
  const { user, bookingTime, price, services, id } = request;
  const title = 'Checkout Request';
  const [visible, setVisible] = useState(false);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    setVisible(false);
  };

  const submitHandler = () => {
    http.get(`/requests/checkout/${id}`).then(({ data }) => {
      message.success('Request has been checkout.');
      onSuccess().then(() => {
        closedHandler();
      });
    });
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
            <Typography.Title level={4}>Request Detail</Typography.Title>
          </Col>
          <Col span={24}>
            <Table rowKey="id" dataSource={services}>
              <ColumnGroup
                align="center"
                title={<Typography.Title level={4}>Services</Typography.Title>}
              >
                <Column align="center" title="Name" dataIndex="serviceName" />
                <Column align="center" title="Price" dataIndex="servicePrice" />
              </ColumnGroup>
              <ColumnGroup
                align="center"
                title={
                  <Typography.Title level={4}>Replace Parts</Typography.Title>
                }
              >
                <Column
                  align="center"
                  title="Name"
                  render={(_, record) => {
                    const { part } = record;
                    return part.partName;
                  }}
                />
                <Column
                  align="center"
                  title="Quantity"
                  render={(_, record) => {
                    const { part } = record;
                    return part.quantity;
                  }}
                />
                <Column
                  align="center"
                  title="Price"
                  render={(_, record) => {
                    const { part } = record;
                    return part.price;
                  }}
                />
                <Column
                  align="center"
                  title="Total Price"
                  render={(_, record) => {
                    const { part } = record;
                    return part.price * part.quantity;
                  }}
                />
              </ColumnGroup>
            </Table>
          </Col>
          <Col span={8} offset={16}>
            <Row align="middle" justify="end" style={{ textAlign: 'right' }}>
              <Col span={8}>
                <Typography.Text>Services:</Typography.Text>
              </Col>
              <Col span={16}>
                <Typography.Title level={5}>{price.services}</Typography.Title>
              </Col>
              <Col span={8}>
                <Typography.Text>Parts:</Typography.Text>
              </Col>
              <Col span={16}>
                <Typography.Title level={5}>{price.parts}</Typography.Title>
              </Col>
              <Col span={8}>
                <Typography.Text>Total:</Typography.Text>
              </Col>
              <Col span={16}>
                <Typography.Title level={5}>{price.total}</Typography.Title>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default RequestCheckoutButton;
