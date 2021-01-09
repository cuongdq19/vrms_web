import { Form, Input, InputNumber, TimePicker } from 'antd';
import React from 'react';
import moment from 'moment';

import CustomMap from '../custom-map/custom-map.component';
import CustomModal from '../custom-modal/custom-modal.component';

const ProviderFormModal = ({
  title,
  visible,
  onSubmit,
  onCancel,
  item,
  ...rest
}) => {
  const [form] = Form.useForm();

  const submitHandler = (values) => {
    const body = {
      id: values.id,
      address: values.address,
      closeTime: values.workingTime[1].unix(),
      latitude: values.latitude,
      longitude: values.longitude,
      openTime: values.workingTime[0].unix(),
      providerName: values.providerName,
      slotCapacity: values.slotCapacity,
      slotDuration:
        values.slotDuration.hour() * 60 + values.slotDuration.minutes(),
    };
    onSubmit(body);
  };

  return (
    <CustomModal
      title={title}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={submitHandler}
        initialValues={{
          id: item?.id,
          providerName: item?.name,
          address: item?.address,
          latitude: item?.latitude,
          longitude: item?.longitude,
          workingTime: [
            moment(item?.openTime, 'HH:mm'),
            moment(item?.closeTime, 'HH:mm'),
          ],
          slotDuration: moment(
            Math.floor(item?.slotDuration) / 60 +
              ':' +
              (item?.slotDuration % 60),
            'HH:mm'
          ),
          slotCapacity: item?.slotCapacity,
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Name" name="providerName">
          <Input />
        </Form.Item>
        <Form.Item name="latitude" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="longitude" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <CustomMap
            position={{ lat: item?.latitude, lng: item?.longitude }}
            onSearch={(address, latitude, longitude) =>
              form.setFieldsValue({ address, latitude, longitude })
            }
          />
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
      </Form>
    </CustomModal>
  );
};

export default ProviderFormModal;
