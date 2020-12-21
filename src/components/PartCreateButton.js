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
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

import http from '../http';
import { useSelector } from 'react-redux';

const { Option } = Select;

const PartCreateButton = ({ children, onSuccess }) => {
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
    const formData = new FormData();
    formData.append('providerId', providerId);
    Object.keys(values).forEach((key) => {
      switch (key) {
        case 'modelIds':
          values[key].forEach((value) => formData.append(key, value));
          break;
        case 'images':
          values[key].forEach((value) =>
            formData.append(key, value.originFileObj)
          );
          break;
        case 'categoryId':
          formData.append(key, values[key][1]);
          break;
        default:
          formData.append(key, values[key]);
          break;
      }
    });
    http
      .post('/parts', formData)
      .then((res) => {
        message.success('Create success');
        setVisible(false);
        onSuccess();
      })
      .catch((err) => console.log(err));
  };

  const manufacturerChangedHandler = (manuId) => {
    http
      .get(`/models/manufacturers/${manuId}`)
      .then(({ data }) => setModels(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (visible) {
      http.get('/service-type-details/sections').then(({ data }) => {
        const cateOptions = Object.keys(data).map((key, index) => ({
          label: key,
          value: index,
          children: data[key].map((data) => ({
            value: data.id,
            label: data.name,
          })),
        }));
        setCategories(cateOptions);
      });
      http.get('/manufacturers').then(({ data }) => {
        setManufacturers(data);
      });
    }
  }, [visible]);

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={clickedHandler}>
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
      >
        <Form layout="vertical" form={form} onFinish={submitHandler}>
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
            <Input placeholder="Part Description" />
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
          <Form.Item
            name="images"
            label="Images"
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
                <Select mode="multiple">
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

export default PartCreateButton;
