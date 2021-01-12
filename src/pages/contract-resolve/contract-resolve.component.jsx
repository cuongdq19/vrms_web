import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  TimePicker,
  Upload,
} from 'antd';
import React, { useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import CustomMap from '../../components/custom-map/custom-map.component';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import { Title } from './contract-resolve.styles';

import { gender } from '../../utils/constants';
import http from '../../http';

const ContractResolve = () => {
  const { contractId } = useParams();
  const [form] = Form.useForm();

  const [redirect, setRedirect] = useState(false);

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
        setRedirect(true);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  if (redirect) {
    return <Redirect to="/contracts" />;
  }

  return (
    <LayoutWrapper>
      <Title>
        <h1>Resolve Contract #{contractId}</h1>
        <Button onClick={() => form.submit()}>Submit</Button>
      </Title>
      <Form layout="vertical" form={form} onFinish={submitHandler}>
        <h2>Manager Account</h2>
        <Form.Item name="username" label="Username">
          <Input />
        </Form.Item>
        <Form.Item name="fullName" label="Full Name">
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Radio.Group>
            {Object.keys(gender).map((key) => (
              <Radio key={key} value={gender[key]}>
                {key}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <h2>Provider Information</h2>
        <Form.Item initialValue={contractId} name="contractId" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Name" name="providerName">
          <Input />
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
          <InputNumber min={1} type="number" style={{ width: '100%' }} />
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
            <Button icon={<UploadOutlined />}>Click to upload</Button>
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
    </LayoutWrapper>
  );
};

export default ContractResolve;
