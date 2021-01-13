import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Upload,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import http from '../../http';
import ModelsSelect from '../models-select/models-select.component';
import CustomModal from '../custom-modal/custom-modal.component';

const PartModal = ({ visible = false, item, providerId, title, onClose }) => {
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
  const [partModels, setPartModels] = useState([]);
  const [images, setImages] = useState([]);

  const submitHandler = (values) => {
    if (!item) {
      const formData = new FormData();
      formData.append('providerId', providerId);
      partModels.forEach((modelId) => formData.append('modelIds', modelId));
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
          setPartModels([]);
          onClose();
          message.success('Create success');
        })
        .catch((err) => console.log(err));
    } else {
      const reqBody = {
        ...values,
        modelIds: partModels,
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
    if (visible) {
      setSections((curr) => ({ ...curr, loading: true }));
      http.get('/service-type-details/sections/categories').then(({ data }) => {
        setSections({ loading: false, data });
      });
    }
  }, [visible]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  return (
    <>
      <CustomModal
        title={title}
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
              setImages(e.fileList);
              return e && e.fileList;
            }}
            help="You can upload images first to detect the category of this item."
          >
            <Upload
              name="logo"
              beforeUpload={(file, fileList) => {
                if (!images.length) {
                  const formData = new FormData();
                  formData.append('file', file);
                  http
                    .post('/detections/parts/categories', formData)
                    .then(({ data }) => {
                      if (data.length > 0) {
                        const sectionId = sections.data.find(
                          (sect) =>
                            sect.categories.findIndex(
                              (cate) => cate.id === data[0]
                            ) >= 0
                        ).sectionId;
                        form.setFieldsValue({
                          categoryId: [sectionId, data[0]],
                        });
                      } else {
                        message.info(
                          'Cannot detect the category of this image.'
                        );
                      }
                    });
                }
                return false;
              }}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Row gutter={8}>
            <Col span={24}>
              <ModelsSelect
                models={partModels}
                onChange={(value) => setPartModels(value)}
              />
            </Col>
          </Row>
        </Form>
      </CustomModal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    providerId: state.auth?.userData?.providerId,
  };
};

export default connect(mapStateToProps)(PartModal);
