import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, Row, Upload } from 'antd';
import React, { useEffect } from 'react';

import CustomModal from '../custom-modal/custom-modal.component';
import { Text } from './contract-upload-modal.styles';

const ContractUploadModal = ({ visible, onCancel, onSubmit, item }) => {
  const [form] = Form.useForm();

  const submitHandler = ({ images, ...rest }) => {
    onSubmit({ ...rest, images: images.map((image) => image.originFileObj) });
  };

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [form, visible]);

  return (
    <CustomModal
      title="Upload Contract"
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      forceRender
    >
      <Form
        form={form}
        onFinish={submitHandler}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
      >
        <Form.Item initialValue={item?.id} name="contractId" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Fullname" labelAlign="right">
          <Text>{item?.fullName}</Text>
        </Form.Item>
        <Form.Item label="Address">
          <Text>{item?.address}</Text>
        </Form.Item>
        <Form.Item label="Phone Number">
          <Text>{item?.phoneNumber}</Text>
        </Form.Item>
        <Form.Item label="Email">
          <Text>{item?.email}</Text>
        </Form.Item>
        <Form.Item label="Provider Image">
          <Row gutter={[8, 8]}>
            {item?.proofImageUrls.map((imageUrl, index) => (
              <Col key={index} span={6}>
                <Image height={250} src={imageUrl} />
              </Col>
            ))}
          </Row>
        </Form.Item>
        <Form.Item
          name="images"
          label="Contract Files"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            console.log('Upload event:', e);
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
        >
          <Upload name="logo" beforeUpload={() => false} listType="text">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </CustomModal>
  );
};

export default ContractUploadModal;
