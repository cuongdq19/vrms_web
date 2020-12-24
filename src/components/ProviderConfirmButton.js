import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Upload,
} from 'antd';
import React, { useState } from 'react';

import http from '../http';

const ProviderConfirmButton = ({ children, onSuccess, contract }) => {
  const { proofImageUrls, id } = contract;
  const title = 'Confirm as New Provider';
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const submitHandler = (values) => {
    const { images, contractId } = values;
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image.originFileObj);
    });
    http.post(`/contracts/confirm/${contractId}`, formData).then(({ data }) => {
      message.success('Confirm contract success.');
      onSuccess().then(() => {
        closedHandler();
      });
    });
  };

  return (
    <>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        width="50%"
        visible={visible}
        title={title}
        onCancel={closedHandler}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Form.Item initialValue={id} name="contractId" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Provider Image">
            <Row gutter={[8, 8]}>
              {proofImageUrls.map((imageUrl, index) => (
                <Col key={index} span={8}>
                  <Image height={200} src={imageUrl} />
                </Col>
              ))}
            </Row>
          </Form.Item>
          <Form.Item
            name="images"
            label="Contract Images"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              console.log('Upload event:', e);
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload name="logo" beforeUpload={() => false} listType="picture">
              <Button
                icon={
                  <FontAwesomeIcon
                    icon={faFileUpload}
                    style={{ marginRight: 10 }}
                  />
                }
              >
                Click to upload
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProviderConfirmButton;
