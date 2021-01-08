import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, Row, Upload } from 'antd';
import React from 'react';

import CustomModal from '../custom-modal/custom-modal.component';

const ContractUploadModal = ({ visible, onCancel, onSubmit, item }) => {
  const [form] = Form.useForm();

  const submitHandler = ({ images, ...rest }) => {
    onSubmit({ ...rest, images: images.map((image) => image.originFileObj) });
  };

  return (
    <CustomModal
      title="Upload Contract"
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={submitHandler} layout="vertical">
        <Form.Item initialValue={item?.id} name="contractId" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Provider Image">
          <Row gutter={[8, 8]}>
            {item?.proofImageUrls.map((imageUrl, index) => (
              <Col key={index} span={8}>
                <Image height={200} src={imageUrl} />
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
