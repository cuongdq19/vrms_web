import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import http from '../http';

const { Option } = Select;

const ServiceCreateButton = ({ children, onSuccess }) => {
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(true);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTypeDetails, setServiceTypeDetails] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [manufacturers, setManufacturers] = useState([]);
  // const [models, setModels] = useState([]);
  const [parts, setParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setSelectedParts([]);
    setVisible(false);
  };

  const serviceTypeChangedHandler = (typeId) => {
    http
      .post('/service-type-details', [typeId])
      .then(({ data }) => setServiceTypeDetails(data));
  };

  // const manufacturerChangedHandler = (manuId) => {
  //   http
  //     .get(`/models/manufacturers/${manuId}`)
  //     .then(({ data }) => setModels(data));
  // };

  const sectionChangedHandler = (sectionId) => {
    http
      .get(`/service-type-details/categories/sections/${sectionId}`)
      .then(({ data }) => {
        setCategories(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const categoryChangedHandler = (categoryId) => {
    http
      .get(`/parts/categories/${categoryId}/providers/${providerId}`)
      .then(({ data }) => {
        setParts(data);
      });
  };

  const partSelectedHandler = (part) => {
    const updatedSelected = [...selectedParts];
    const index = updatedSelected.findIndex(
      (selected) => selected.id === part.id
    );
    if (index >= 0) {
      // Update
      updatedSelected[index].quantity++;
    } else {
      // Add
      updatedSelected.push({ ...part, quantity: 1 });
    }
    setSelectedParts(updatedSelected);
  };

  const partRemovedHandler = (partId) => {
    const updatedSelected = [...selectedParts];
    const index = updatedSelected.findIndex(
      (selected) => selected.id === partId
    );
    if (index >= 0) {
      // Decrease
      if (updatedSelected[index].quantity > 1) {
        updatedSelected[index].quantity--;
      } else {
        updatedSelected.splice(index, 1);
      }
    } else {
      // Remove
      return;
    }
    setSelectedParts(updatedSelected);
  };

  const submitHandler = (values) => {
    const { typeDetailId, modelIds, name, price } = values;
    const reqBody = {
      typeDetailId,
      groupPriceRequest: {
        modelIds,
        name,
        price,
      },
    };
    http
      .post(`/services/providers/${providerId}`, reqBody)
      .then(({ data }) => {
        message.success('Create service success.');
        closedHandler();
        onSuccess();
      })
      .catch((err) => console.log(err));
  };

  const fetchSelections = useCallback(() => {
    if (visible) {
      http.get('/service-types').then(({ data }) => {
        setServiceTypes(data);
      });
      // .then(({ data }) => {
      //   setManufacturers(data);
      //   return http.get('/models');
      // })
      // .then(({ data }) => setModels(data));
    }
  }, [visible]);

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={clickedHandler}>
        {children}
      </Button>
      <Modal
        width="80%"
        centered
        maskClosable={false}
        onOk={() => form.submit()}
        visible={visible}
        onCancel={closedHandler}
        title="Create Service"
      >
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Row gutter={8}>
            <Col span={10}>
              <Form.Item label="Service Type">
                <Select onChange={serviceTypeChangedHandler}>
                  {serviceTypes.map((st) => (
                    <Option key={st.id} value={st.id}>
                      {st.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="typeDetailId" label="Section Name">
                <Select
                  disabled={serviceTypeDetails.length === 0}
                  onSelect={(_, option) => {
                    sectionChangedHandler(option.section);
                  }}
                >
                  {serviceTypeDetails.map((std) => (
                    <Option section={std.sectionId} key={std.id} value={std.id}>
                      {std.sectionName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="name" label="Service Name">
            <Input placeholder="Enter service name" />
          </Form.Item>
          {/* <Row gutter={8}>
            <Col span={4}>
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
              <Form.Item label="Models" name="modelIds">
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
            <Col span={4}>
              <Form.Item name="price" label="Price">
                <InputNumber style={{ width: '100%' }} type="number" min={0} />
              </Form.Item>
            </Col>
          </Row> */}
          <Row gutter={8}>
            <Col span={10}>
              <Row>
                <Col span={24}>
                  <Form.Item name="categoryId" label="Category">
                    <Select
                      disabled={categories.length === 0}
                      onChange={categoryChangedHandler}
                    >
                      {categories.map((cate) => (
                        <Option key={cate.id} value={cate.id}>
                          {cate.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {selectedParts.map((part) => (
                  <Row key={part.id} gutter={[8, 8]}>
                    <Col span={6}>{part.name}</Col>
                    <Col span={6}>{part.price}</Col>
                    <Col span={6}>{part.quantity}</Col>
                    <Col span={6}>
                      <Button onClick={() => partRemovedHandler(part.id)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Row>
            </Col>
            <Col span={14}>
              {parts.map((part) => (
                <Row key={part.id} gutter={[8, 8]}>
                  <Col span={8}>{part.name}</Col>
                  <Col span={8}>{part.price}</Col>
                  <Col span={8}>
                    <Button onClick={() => partSelectedHandler(part)}>
                      Select
                    </Button>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceCreateButton;
