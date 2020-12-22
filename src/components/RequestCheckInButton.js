import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Radio,
  Row,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import http from '../http';

const UserCardRadio = ({ user }) => {
  const { fullName, id } = user;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '15rem',
      }}
    >
      <div style={{ flex: 1 }}>
        <Typography.Title level={5}>{fullName}</Typography.Title>
      </div>
      <div style={{ height: '10rem' }}>
        <img
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          src={
            'https://images.unsplash.com/photo-1544806145-8ae17e81eca7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80'
          }
          alt={fullName}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Radio value={id} />
      </div>
    </div>
  );
};

const RequestCheckInButton = ({ children, request, onSuccess }) => {
  const title = `Check In Request #${request.id}`;
  const { bookingTime, id: requestId } = request;

  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const submitHandler = ({ technicianId }) => {
    http
      .post(`/requests/checkin/${requestId}/technicians/${technicianId}`)
      .then(({ data }) => {
        message.success('Check in request success.');
        onSuccess().then(() => {
          closedHandler();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAvailableUsers = useCallback(() => {
    if (visible) {
      http
        .get(`/providers/${providerId}/timestamp/${bookingTime}`)
        .then(({ data }) => {
          setUsers(data);
        });
    }
  }, [bookingTime, providerId, visible]);

  useEffect(() => {
    fetchAvailableUsers();
  }, [fetchAvailableUsers]);

  return (
    <>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        width="70%"
        visible={visible}
        onCancel={closedHandler}
        onOk={() => form.submit()}
        title={title}
      >
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Form.Item name="technicianId" label="Technician">
            <Radio.Group>
              <Row justify="space-between" gutter={8}>
                {users.map((user) => (
                  <Col flex key={user.id} span={Math.floor(24 / users.length)}>
                    <UserCardRadio user={user} />
                  </Col>
                ))}
              </Row>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RequestCheckInButton;
