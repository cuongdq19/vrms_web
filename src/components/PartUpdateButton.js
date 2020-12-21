import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';

import http from '../http';
import { useSelector } from 'react-redux';

const { Option } = Select;

const PartUpdateButton = ({ children, onSuccess, part }) => {
  const {
    id,
    name,
    description,
    price,
    warrantyDuration,
    monthsPerMaintenance,
    categoryId,
    models: partModels,
  } = part;

  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [form] = Form.useForm();

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const submitHandler = (values) => {
    const reqBody = { ...values, categoryId: values.categoryId[1], providerId };
    console.log(reqBody);
    http.post(`/parts/${reqBody.id}`, reqBody).then((res) => {
      message.success('Create success');
      closedHandler();
      onSuccess();
    });
  };

  const manufacturerChangedHandler = (manuId) => {
    http
      .get(`/models/manufacturers/${manuId}`)
      .then(({ data }) => setModels(data));
  };

  useEffect(() => {
    if (visible) {
      http
        .get('/service-type-details/sections')
        .then(({ data }) => {
          const cateOptions = Object.keys(data).map((key, index) => ({
            label: key,
            value: index,
            children: data[key].map((data) => ({
              value: data.id,
              label: data.name,
            })),
          }));
          setCategories(cateOptions);
          return http.get('/manufacturers').then(({ data }) => {
            setManufacturers(data);
          });
        })
        .then(() => {
          http.get('/models').then(({ data }) => setModels(data));
        });
    }
  }, [visible]);

  useEffect(() => {
    form.setFieldsValue({
      id,
      name,
      description,
      price,
      warrantyDuration,
      monthsPerMaintenance,
      categoryId: [
        categories.find(
          (cate) =>
            cate.children.findIndex((child) => child.value === categoryId) > -1
        )?.value,
        categoryId,
      ],
      modelIds: partModels.map((model) => model.id),
    });
  }, [
    categories,
    categoryId,
    description,
    form,
    id,
    monthsPerMaintenance,
    name,
    partModels,
    price,
    warrantyDuration,
  ]);

  return (
    <>
      <Button type="primary" onClick={clickedHandler}>
        {children}
      </Button>
      <Modal
        centered
        width="70%"
        title="Create Part"
        maskClosable={false}
        visible={visible}
        onOk={() => form.submit()}
        onCancel={closedHandler}
        forceRender
      >
        <Form layout="vertical" form={form} onFinish={submitHandler}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Please input part name',
              },
            ]}
          >
            <Input placeholder="Part Name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: 'Please input description',
              },
            ]}
          >
            <Input.TextArea placeholder="Part Description" />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[
              {
                required: true,
                message: 'Please select categories',
              },
            ]}
          >
            <Cascader options={categories} />
          </Form.Item>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Price"
                rules={[
                  {
                    required: true,
                    message: 'Please input part price',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} type="number" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="monthsPerMaintenance"
                label="Maintenance (months)"
                rules={[
                  {
                    required: true,
                    message: 'Please input maintenance time',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} type="number" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="warrantyDuration"
                label="Duration Warranty"
                rules={[
                  {
                    required: true,
                    message: 'Please input warranty duration',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} type="number" min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item label="Manufacturer">
                <Select onChange={manufacturerChangedHandler}>
                  {manufacturers.map((m) => (
                    <Option key={m.id} value={m.id}>
                      {m.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="modelIds"
                label="Models"
                rules={[
                  {
                    required: true,
                    message: 'Please select models',
                  },
                ]}
              >
                <Select mode="multiple" allowClear>
                  {models.map((model) => (
                    <Option key={model.id} value={model.id}>
                      {model.manufacturerName} {model.name} {model.fuelType}{' '}
                      {model.gearbox} ({model.year})
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

export default PartUpdateButton;
