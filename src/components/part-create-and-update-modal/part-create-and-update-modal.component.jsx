import React, { useEffect, useState } from 'react';
import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import CustomModal from '../custom-modal/custom-modal.component';
import http from '../../http';
import { modelToString } from '../../utils';
import {
  loadPartFormStart,
  closePartModal,
  createPartStart,
  updatePartStart,
} from '../../redux/part/part.actions';

const PartCreateAndUpdateModal = ({
  visible,
  sectionsWithCategories,
  models,
  manufacturers,
  item,
  onLoadForm,
  onCloseModal,
  onCreatePart,
  onUpdatePart,
}) => {
  const [form] = Form.useForm();

  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState({
    manufacturerId: 0,
  });

  const submitHandler = (values) => {
    if (item) {
      onUpdatePart(values);
    } else {
      onCreatePart(values);
    }
  };

  useEffect(() => {
    if (visible) {
      onLoadForm();
    }
  }, [onLoadForm, visible]);

  useEffect(() => {
    if (item) {
      const {
        id,
        name,
        description,
        categoryId,
        sectionId,
        price,
        warrantyDuration,
        monthsPerMaintenance,
        models,
      } = item;
      form.setFieldsValue({
        id,
        name,
        description,
        categoryId: [sectionId, categoryId],
        price,
        warrantyDuration,
        monthsPerMaintenance,
        modelIds: models.map((m) => m.id),
      });
    }
  }, [form, item]);

  const filteredModels = models.filter((m) =>
    filters.manufacturerId <= 0
      ? true
      : filters.manufacturerId === m.manufacturerId
  );

  return (
    <CustomModal
      visible={visible}
      onCancel={() => {
        form.resetFields();
        setImages([]);
        onCloseModal();
      }}
      title="Create Part"
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={submitHandler}>
        {item ? (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        ) : null}
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea autoSize />
        </Form.Item>
        <Form.Item label="Category" name="categoryId">
          <Cascader
            options={sectionsWithCategories.map(
              ({ categories, sectionId, sectionName, ...rest }) => ({
                label: sectionName,
                value: sectionId,
                children: categories.map((cate) => ({
                  label: cate.name,
                  value: cate.id,
                })),
              })
            )}
          />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Price" name="price">
              <InputNumber type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Maintenance (months)" name="monthsPerMaintenance">
              <InputNumber type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Warranty Duration" name="warrantyDuration">
              <InputNumber type="number" min={0} />
            </Form.Item>
          </Col>
        </Row>
        {!item ? (
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
                        const sectionId = sectionsWithCategories.find(
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
        ) : null}
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item label="Manufacturers">
              <Select
                allowClear
                onClear={() => {
                  setFilters((curr) => ({ ...curr, manufacturerId: 0 }));
                }}
                onSelect={(value) => {
                  setFilters((curr) => ({ ...curr, manufacturerId: value }));
                }}
                options={manufacturers.map((m) => ({
                  label: m.name,
                  value: m.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item
              label="Models"
              name="modelIds"
              rules={[
                {
                  required: true,
                  message: "Models can't be blank.",
                  type: 'array',
                  min: 1,
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                mode="multiple"
                onClear={() =>
                  setFilters((curr) => ({ ...curr, partModelIds: [] }))
                }
                onChange={(value) =>
                  setFilters((curr) => ({ ...curr, partModelIds: value }))
                }
                options={filteredModels.map((m) => ({
                  label: modelToString(m),
                  value: m.id,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
};

const mapStateToProps = (state) => ({
  sectionsWithCategories: state.categories.categories,
  models: state.models.models,
  manufacturers: state.manufacturers.manufacturers,
  visible: state.parts.isModalVisible,
});

const mapDispatchToProps = (dispatch) => ({
  onLoadForm: () => dispatch(loadPartFormStart()),
  onCloseModal: () => dispatch(closePartModal()),
  onCreatePart: (newPart) => dispatch(createPartStart(newPart)),
  onUpdatePart: (updatedPart) => dispatch(updatePartStart(updatedPart)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PartCreateAndUpdateModal);
