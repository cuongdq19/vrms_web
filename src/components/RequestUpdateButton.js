import { Button, Col, Image, Modal, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const RequestUpdateButton = ({ children, onClick }) => {
  const requestData = useSelector((state) => state.requests.updating);
  const title = 'Update Request';
  const [visible, setVisible] = useState(false);

  const clickedHandler = () => {
    onClick();
    setVisible(true);
  };

  const closedHandler = () => {
    setVisible(false);
  };

  return (
    <>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        visible={visible}
        maskClosable={false}
        onCancel={closedHandler}
        width="90%"
        title={title}
      >
        {requestData?.services.map((service) => {
          const { id, serviceName, servicePrice, parts } = service;
          return (
            <Row key={id} align="middle" gutter={[8, 8]}>
              <Col span={8} style={{ border: '1px solid black' }}>
                <Typography.Title level={5}>{serviceName}</Typography.Title>
                <Typography.Text>{servicePrice}</Typography.Text>
              </Col>
              <Col span={12} style={{ border: '1px solid black' }}>
                {parts.map((part) => {
                  const { id, partName, quantity, price, imageUrls } = part;
                  return (
                    <Row key={id} align="middle">
                      <Col span={4}>
                        <Image src={imageUrls[0]} width="100%" />
                      </Col>
                      <Col span={8}>{partName}</Col>
                      <Col span={6}>{price}</Col>
                      <Col span={6}>{quantity}</Col>
                    </Row>
                  );
                })}
              </Col>
              <Col span={4} style={{ border: '1px solid black' }}>
                <Button danger>Remove</Button>
              </Col>
            </Row>
          );
        })}
      </Modal>
    </>
  );
};

export default RequestUpdateButton;
