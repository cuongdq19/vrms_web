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
import React, { useCallback, useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

import http from '../../http';
import { connect } from 'react-redux';

const { Option } = Select;

const PartModal = ({ visible, item, providerId, onClose }) => {
  const {
    id,
    name,
    description,
    price,
    warrantyDuration,
    monthsPerMaintenance,
    sectionId,
    categoryId,
    models: itemModels,
  } = item || {};
  const [form] = Form.useForm();
  const [sections, setSections] = useState({
    data: [],
    loading: false,
  });
  const [manufacturers, setManufacturers] = useState({
    data: [],
    loading: false,
  });
  const [models, setModels] = useState({ loading: false, data: [] });

  const submitHandler = (values) => {
    if (!item) {
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
        .then(() => {
          form.resetFields();
          onClose();
          message.success('Create success');
        })
        .catch((err) => console.log(err));
    } else {
      const reqBody = {
        ...values,
        id,
        categoryId: values.categoryId[1],
        providerId,
      };
      http.post(`/parts/${reqBody.id}`, reqBody).then(() => {
        form.resetFields();
        onClose();
        message.success('Update success');
      });
    }
  };

  const loadOptions = useCallback(() => {
    setSections((curr) => ({ ...curr, loading: true }));
    http
      .get('/service-type-details/sections/categories')
      .then(({ data }) => setSections({ loading: false, data }));

    setManufacturers((curr) => ({ ...curr, loading: true }));
    http
      .get('/manufacturers')
      .then(({ data }) => setManufacturers({ loading: false, data }));

    setModels((curr) => ({ ...curr, loading: true }));
    http.get('/models').then(({ data }) => setModels({ loading: false, data }));
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  return (
    <>
      <Modal
        centered
        width="70%"
        title="Create Part"
        maskClosable={false}
        visible={visible}
        onCancel={onClose}
        onOk={() => form.submit()}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={submitHandler}
          initialValues={
            item
              ? {
                  name,
                  description,
                  price,
                  categoryId: [sectionId, categoryId],
                  warrantyDuration,
                  monthsPerMaintenance,
                  modelIds: itemModels.map((model) => model.id),
                }
              : {}
          }
        >
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
            <Cascader
              options={sections.data.map(
                ({ sectionName, sectionId, categories }) => ({
                  label: sectionName,
                  value: sectionId,
                  children: categories.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                })
              )}
            />
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
                <Select loading={manufacturers.loading}>
                  {manufacturers.data.map((m) => (
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
                <Select mode="multiple" loading={models.loading}>
                  {models.data.map((model) => (
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

const mapStateToProps = ({
  auth: {
    userData: { providerId },
  },
}) => {
  return {
    providerId,
  };
};

export default connect(mapStateToProps)(PartModal);
