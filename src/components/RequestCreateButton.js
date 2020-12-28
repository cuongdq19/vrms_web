import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { useState } from 'react';

import http from '../http';

const { Option } = Select;

const RequestCreateButton = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState();

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    setVisible(false);
  };

  const searchHandler = (phoneNumber) => {
    http
      .get(`/users/phone/${phoneNumber}`)
      .then(({ data }) => {
        if (!data) {
          form.setFields([{ name: 'phoneNumber', errors: ['User not found'] }]);
        } else {
          form.setFields([{ name: 'phoneNumber', errors: [] }]);
          setUser(data);
        }
      })
      .catch((err) => {
        form.setFields([{ name: 'phoneNumber', errors: ['User not found'] }]);
      });
  };
  return (
    <>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        width="70%"
        title="Create Request"
        visible={visible}
        maskClosable={false}
        onCancel={closedHandler}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical">
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item label="Phone Number" name="phoneNumber">
                <Input.Search onSearch={searchHandler} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="vehicleId" label="Vehicle">
                <Select disabled={!user}>
                  {user?.vehicles.map(({ vehicle }) => (
                    <Option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plateNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default RequestCreateButton;
