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
  Table,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';

import http from '../http';
import * as actions from '../store/actions';

const { Option } = Select;

const ServiceUpdateWithPartsButton = ({
  children,
  typeDetail,
  serviceDetail,
  modelsData,
  servicesData,
  partsData,
  onFetchSections,
  onSuccess,
  onInitUpdateService,
}) => {
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [partsFilters, setPartsFilters] = useState({
    modelIds: [],
    categoryId: 0,
  });
  const [selectedParts, setSelectedParts] = useState([]);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const serviceTypeChangedHandler = (typeId) => {
    onFetchSections(typeId);
  };

  const partSelectedHandler = (part) => {
    const updatedSelected = [...selectedParts];
    if (updatedSelected.length === 0) {
      const { models } = part;
      setPartsFilters((curr) => ({
        ...curr,
        modelIds: models.map((model) => model.id),
      }));
    }
    const index = updatedSelected.findIndex((p) => p.id === part.id);
    if (index >= 0) {
      updatedSelected[index].quantity++;
    } else {
      updatedSelected.push({ ...part, quantity: 1 });
    }

    setSelectedParts(updatedSelected);
  };

  const partRemovedHandler = (partId) => {
    const updatedSelected = [...selectedParts];
    const index = updatedSelected.findIndex((p) => p.id === partId);
    if (index >= 0) {
      if (updatedSelected[index].quantity > 1) {
        updatedSelected[index].quantity--;
      } else {
        updatedSelected.splice(index, 1);
      }
      if (updatedSelected.length === 0) {
        setPartsFilters((curr) => ({ ...curr, modelIds: [] }));
      }
    } else {
      return;
    }
    setSelectedParts(updatedSelected);
  };

  const submitHandler = (values) => {
    const { name, price } = values;
    const partQuantity = {};
    selectedParts.forEach((part) => {
      partQuantity[part.id] = part.quantity;
    });
    http
      .post(`/services/${serviceDetail.id}/replacing`, {
        name,
        partQuantity,
        price,
      })
      .then(({ data }) => {
        message.success('Update service success.');
        closedHandler();
        onSuccess();
      })
      .catch((err) => console.log(err));
  };

  const fetchSelections = useCallback(() => {
    if (visible) {
      onInitUpdateService(typeDetail, serviceDetail);
    }
  }, [visible, onInitUpdateService, typeDetail, serviceDetail]);

  useEffect(() => {
    setSelectedParts(serviceDetail.parts);
    fetchSelections();
  }, [fetchSelections, serviceDetail.parts]);

  return (
    <>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        width="100%"
        centered
        maskClosable={false}
        onOk={() => form.submit()}
        visible={visible}
        onCancel={closedHandler}
        title="Update Service"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submitHandler}
          initialValues={{
            typeId: typeDetail.typeId,
            typeDetailId: typeDetail.id,
            name: serviceDetail.name,
            modelIds: serviceDetail.modelIds,
            price: serviceDetail.price,
          }}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="typeId"
                label="Service Type"
                rules={[
                  { required: true, message: "Service Type can't be blank!" },
                ]}
              >
                <Select onChange={serviceTypeChangedHandler}>
                  {servicesData.serviceTypesData.map((st) => (
                    <Option key={st.id} value={st.id}>
                      {st.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="typeDetailId"
                label="Section Name"
                rules={[
                  { required: true, message: "Section Name can't be blank!" },
                ]}
              >
                <Select disabled={servicesData.sectionsData.length === 0}>
                  {servicesData.sectionsData.map((std) => (
                    <Option key={std.id} value={std.id}>
                      {std.sectionName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="name"
            label="Service Name"
            rules={[
              { required: true, message: "Service Name can't be blank!" },
            ]}
          >
            <Input placeholder="Enter service name" />
          </Form.Item>
          <Row gutter={8}>
            <Col span={20}>
              <Form.Item
                label="Models"
                name="modelIds"
                // rules={[
                //   () => ({
                //     validator: (rule, value) => {
                //       if (partsFilters.modelIds.length === 0) {
                //         return Promise.reject("Models can't be blank!");
                //       }
                //       return Promise.resolve();
                //     },
                //   }),
                // ]}
              >
                <Select mode="multiple" value={partsFilters.modelIds}>
                  {modelsData.map((model) => (
                    <Option key={model.id} value={model.id}>
                      {model.manufacturerName} {model.name} {model.fuelType}{' '}
                      {model.gearbox} ({model.year})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Price can't be blank!" }]}
              >
                <InputNumber style={{ width: '100%' }} type="number" min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={10}>
              <Form.Item label="Available Parts">
                <Row gutter={8}>
                  <Col span={12}>
                    <Cascader
                      onChange={([sectionId, categoryId], selectedOptions) => {
                        setPartsFilters((curr) => ({ ...curr, categoryId }));
                      }}
                      options={partsData.sectionsData.map(
                        ({ sectionId, sectionName, categories }) => ({
                          value: sectionId,
                          label: sectionName,
                          children: categories.map((cate) => ({
                            value: cate.id,
                            label: cate.name,
                          })),
                        })
                      )}
                      placeholder="Please select"
                    />
                  </Col>
                  <Col span={12}>
                    {/* <Select>
                        {categoriesData.map((cate) => (
                          <Option key={cate.id} value={cate.id}>
                            {cate.name}
                          </Option>
                        ))}
                      </Select> */}
                  </Col>
                </Row>
                <Table
                  size="small"
                  rowKey="id"
                  dataSource={partsData.partsData.filter(
                    (part) =>
                      (partsFilters.categoryId > 0
                        ? part.categoryId === partsFilters.categoryId
                        : true) &&
                      (partsFilters.modelIds.length > 0
                        ? JSON.stringify(
                            part.models.map((model) => model.id)
                          ) === JSON.stringify(partsFilters.modelIds)
                        : true)
                  )}
                  pagination={{ pageSize: 5 }}
                  columns={[
                    { title: 'Name', align: 'center', dataIndex: 'name' },
                    { title: 'Price', align: 'center', dataIndex: 'price' },
                    {
                      title: 'Category',
                      align: 'center',
                      dataIndex: 'categoryName',
                    },
                    {
                      title: 'Add',
                      align: 'center',
                      render: (_, part) => (
                        <Button onClick={() => partSelectedHandler(part)}>
                          Add
                        </Button>
                      ),
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item label="Selected Parts">
                <Form.Item
                  name="partIds"
                  rules={[
                    () => ({
                      validator: (rule, value) => {
                        if (selectedParts.length === 0) {
                          return Promise.reject("Parts can't be blank!");
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input hidden />
                </Form.Item>
                {selectedParts.length > 0 && (
                  <Table
                    rowKey="id"
                    size="small"
                    dataSource={selectedParts}
                    columns={[
                      { title: 'Name', align: 'center', dataIndex: 'name' },
                      { title: 'Price', align: 'center', dataIndex: 'price' },
                      {
                        title: 'Quantity',
                        align: 'center',
                        dataIndex: 'quantity',
                      },
                      {
                        title: 'Remove',
                        align: 'center',
                        dataIndex: 'id',
                        render: (partId) => (
                          <Button
                            onClick={() => {
                              partRemovedHandler(partId);
                            }}
                          >
                            Remove
                          </Button>
                        ),
                      },
                    ]}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    modelsData: state.vehicles.models,
    servicesData: {
      serviceTypesData: state.services.types,
      sectionsData: state.services.sections,
    },
    partsData: {
      partsData: state.parts.parts,
      sectionsData: state.parts.sections,
    },
    loading: state.services.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitUpdateService: (typeDetail, serviceDetail) =>
      dispatch(actions.initUpdateServiceWithParts(typeDetail, serviceDetail)),
    onFetchSections: (typeId) => dispatch(actions.fetchServiceSections(typeId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceUpdateWithPartsButton);
