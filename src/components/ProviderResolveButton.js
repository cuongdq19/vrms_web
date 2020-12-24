import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  TimePicker,
  Typography,
  Upload,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import http from '../http';
import CustomMap from '../components/CustomMap';
import { Gender } from '../utils/constants';

const { Option } = Select;

const ProviderResolveButton = ({ children, onSuccess, contractId }) => {
  const title = 'Create New Provider';
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const submitHandler = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      switch (key) {
        case 'images':
          values[key].forEach((image) => {
            formData.append(key, image.originFileObj);
          });
          break;
        case 'workingTime':
          formData.append('openTime', values[key][0].unix());
          formData.append('closeTime', values[key][1].unix());
          break;
        case 'slotDuration':
          formData.append(key, values[key].hour() * 60 + values[key].minutes());
          break;
        default:
          formData.append(key, values[key]);
          break;
      }
    });
    http
      .post(`/contracts/resolve/${contractId}`, formData)
      .then(({ data }) => {
        message.success(
          "Resolve contract success. Manager's account has been sent to his/her email.\nThis provider is ready to use."
        );
        return onSuccess();
      })
      .then(() => {
        closedHandler();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchSelections = useCallback(() => {
    if (visible) {
      http
        .get('/manufacturers')
        .then(({ data }) => {
          setManufacturers(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [visible]);

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  return (
    <>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        maskClosable={false}
        width="70%"
        visible={visible}
        title={title}
        centered
        onCancel={closedHandler}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={submitHandler}>
          <Typography.Title level={3}>Manager Account</Typography.Title>
          <Form.Item name="username" label="Username">
            <Input />
          </Form.Item>
          <Form.Item name="fullName" label="Full Name">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Radio.Group>
              {Object.keys(Gender).map((key) => (
                <Radio key={key} value={Gender[key]}>
                  {key}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Typography.Title level={3}>Provider Information</Typography.Title>
          <Form.Item initialValue={contractId} name="contractId" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="providerName">
            <Input />
          </Form.Item>
          <Form.Item label="Manufacturer" name="manufacturerId">
            <Select>
              {manufacturers.map((m) => (
                <Option key={m.id} value={m.id}>
                  {m.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Working Time" name="workingTime">
            <TimePicker.RangePicker
              style={{ width: '100%' }}
              hourStep={1}
              minuteStep={15}
              format="HH:mm"
            />
          </Form.Item>
          <Form.Item label="Slot Duration (minutes)" name="slotDuration">
            <TimePicker
              style={{ width: '100%' }}
              showNow={false}
              hourStep={1}
              minuteStep={5}
              format="HH:mm"
            />
          </Form.Item>
          <Form.Item label="Slot Capacity" name="slotCapacity">
            <InputNumber type="number" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="images"
            label="Upload"
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
          <Form.Item name="latitude" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="longitude" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <CustomMap
              onSearch={(address, latitude, longitude) =>
                form.setFieldsValue({ address, latitude, longitude })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProviderResolveButton;
