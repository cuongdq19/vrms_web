import {
  Button,
  Col,
  message,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
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

const RequestConfirmButton = ({ children, request, onSuccess }) => {
  const { user, bookingTime, totalPrice, services, id } = request;
  const title = 'Confirm Request';
  const [visible, setVisible] = useState(false);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    setVisible(false);
  };

  const submitHandler = () => {
    http.get(`/requests/confirm/${id}`).then(({ data }) => {
      message.success('Request has been confirmed.');
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
          {generateRowContent('Total Price', totalPrice)}
          <Col span={24}>
            <Typography.Title level={4}>Request Detail</Typography.Title>
          </Col>
          <Col span={24}>
            <Table dataSource={services}>
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
        </Row>
      </Modal>
    </>
  );
};

export default RequestConfirmButton;
