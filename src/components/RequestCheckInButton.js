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
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '../store/actions';
import http from '../http';

const UserCardRadio = ({ user }) => {
  const { fullName, id, imageUrl } = user;
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
          src={imageUrl}
          alt={fullName}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Radio value={id} />
      </div>
    </div>
  );
};

const RequestCheckInButton = ({ children, request }) => {
  const title = `Check In Request #${request.id}`;
  const { bookingTime, id: requestId } = request;

  const dispatch = useDispatch();
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
    dispatch(
      actions.checkInRequest(requestId, technicianId, () => {
        message.success('Check in success.');
        closedHandler();
      })
    );
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
          <Form.Item
            name="technicianId"
            label={
              <Typography.Title level={4}>
                Please select the technician for this request:
              </Typography.Title>
            }
          >
            <Radio.Group>
              <Row justify="center" gutter={8}>
                {users.map((user) => (
                  <Col key={user.id} span={6}>
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
