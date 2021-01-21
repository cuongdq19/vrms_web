import React, { useEffect, useState } from 'react';
import {
  Button,
  Cascader,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Radio,
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
  onClose,
  onCreatePart,
  onUpdatePart,
}) => {
  const [form] = Form.useForm();

  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState({
    manufacturerId: 0,
  });
  const [isAccessory, setIsAccessory] = useState(true);
  const [selectCategory, setSelectCategory] = useState({
    visible: false,
    options: [],
    selected: null,
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
        // isAccessory,
      } = item;
      // setIsAccessory(isAccessory);
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
        onClose();
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
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name can't be blank" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description can't be blank" }]}
        >
          <Input.TextArea autoSize />
        </Form.Item>
        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Category can't be blank" }]}
        >
          <Cascader
            onChange={(value, selectedOptions) => {
              setIsAccessory(selectedOptions[1]?.isAccessory ?? false);
            }}
            options={sectionsWithCategories.map(
              ({ categories, sectionId, sectionName, ...rest }) => ({
                label: sectionName,
                value: sectionId,
                children: categories.map((cate) => ({
                  label: cate.name,
                  value: cate.id,
                  isAccessory: cate.isAccessory,
                })),
              })
            )}
          />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Price can't be blank" }]}
            >
              <InputNumber type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Warranty Duration"
              name="warrantyDuration"
              initialValue={0}
              rules={[
                { required: true, message: "Warranty Duration can't be blank" },
              ]}
            >
              <InputNumber disabled={!isAccessory} type="number" min={0} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Times per maintenance"
              name="monthsPerMaintenance"
              initialValue={0}
              rules={[
                { required: true, message: "Time can't be blank" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('warrantyDuration') > value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      'Warranty duration should be longer than times per maintenance.'
                    );
                  },
                }),
              ]}
            >
              <InputNumber type="number" min={0} disabled={!isAccessory} />
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
                        const categoryOptions = data.map((item) => {
                          const section = sectionsWithCategories.find(
                            (sect) =>
                              sect.categories.findIndex(
                                (cate) => cate.id === data[0].categoryId
                              ) >= 0
                          );
                          const category = section.categories.find(
                            (cate) => cate.id === data[0].categoryId
                          );
                          return {
                            ...category,
                            section,
                          };
                        });
                        setSelectCategory((curr) => ({
                          ...curr,
                          visible: true,
                          options: categoryOptions,
                        }));
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
      <CustomModal
        width="60%"
        title="Select Category"
        visible={selectCategory.visible}
        onCancel={() =>
          setSelectCategory({ visible: false, options: [], selected: null })
        }
        onOk={() => {
          form.setFieldsValue({
            categoryId: [
              selectCategory.selected.section.sectionId,
              selectCategory.selected.id,
            ],
          });
          setSelectCategory({ visible: false, options: [], selected: null });
        }}
      >
        <Row justify="center" gutter={[16, 16]}>
          <Col span={24}>
            <Image src={`http://localhost:5000/abc.jpg?${Date.now()}`} />
          </Col>
          <Col span={24}>
            <Radio.Group
              onChange={(event) => {
                setSelectCategory((curr) => ({
                  ...curr,
                  selected: event.target.option,
                }));
              }}
            >
              {selectCategory.options.map((option) => (
                <Radio key={option.id} value={option.id} option={option}>
                  {option.name}
                </Radio>
              ))}
            </Radio.Group>
          </Col>
        </Row>
      </CustomModal>
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
