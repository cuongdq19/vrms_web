import {
  Button,
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
import { useSelector } from 'react-redux';

import http from '../http';

const { Option } = Select;

const PartListWithFilters = ({ onSelect, selectedModels }) => {
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parts, setParts] = useState([]);

  const sectionChangedHandler = (sectionId) => {
    http
      .get(`/service-type-details/categories/sections/${sectionId}`)
      .then(({ data }) => {
        setCategories(data);
      });
  };

  const categoryChangedHandler = (categoryId) => {
    if (!selectedModels) {
      http
        .get(`/parts/categories/${categoryId}/providers/${providerId}`)
        .then(({ data }) => {
          setParts(data);
        });
    } else {
      http
        .post(
          `/parts/categories/${categoryId}/providers/${providerId}`,
          selectedModels
        )
        .then(({ data }) => {
          setParts(data);
        });
    }
  };

  const fetchSelections = useCallback(() => {
    http.get('/service-type-details/sections').then(({ data }) => {
      setSections(data);
    });
  }, []);

  const partSelectedHandler = (part) => {
    const { models, categoryId } = part;
    http
      .post(
        `/parts/categories/${categoryId}/providers/${providerId}`,
        models.map((m) => m.id)
      )
      .then(({ data }) => {
        setParts(data);
        onSelect(part);
      });
  };

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  return (
    <div>
      <Row gutter={8}>
        <Col span={12}>
          <Select onChange={sectionChangedHandler}>
            {sections.map((sect) => (
              <Option key={sect.id} value={sect.id}>
                {sect.sectionName}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select onChange={categoryChangedHandler}>
            {categories.map((cate) => (
              <Option key={cate.id} value={cate.id}>
                {cate.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Table
        rowKey="id"
        dataSource={parts}
        columns={[
          { title: 'Name', align: 'center', dataIndex: 'name' },
          { title: 'Price', align: 'center', dataIndex: 'price' },
          {
            title: 'Add',
            align: 'center',
            render: (_, part) => (
              <Button onClick={() => partSelectedHandler(part)}>Add</Button>
            ),
          },
        ]}
      />
    </div>
  );
};

const ServiceCreateWithPartsButton = ({ children, onSuccess }) => {
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTypeDetails, setServiceTypeDetails] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [selectedModels, setSelectedModels] = useState(null);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const serviceTypeChangedHandler = (typeId) => {
    http
      .post('/service-type-details', [typeId])
      .then(({ data }) => setServiceTypeDetails(data));
  };

  const manufacturerChangedHandler = (manuId) => {
    http
      .get(`/models/manufacturers/${manuId}`)
      .then(({ data }) => setModels(data));
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

    if (!selectedModels) {
      const { models } = part;
      const modelIds = models.map((m) => m.id);
      form.setFieldsValue({ modelIds });
      setSelectedModels(modelIds);
    }
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
      return;
    }
    setSelectedParts(updatedSelected);
  };

  const submitHandler = (values) => {
    const { typeDetailId, name, price } = values;
    const partQuantity = {};
    selectedParts.forEach((part) => {
      partQuantity[part.id] = part.quantity;
    });
    http
      .post(`/services/providers/${providerId}/replacing`, {
        typeDetailId,
        groupPriceRequest: {
          name,
          partQuantity,
          price,
        },
      })
      .then(({ data }) => {
        message.success('Create service success.');
        closedHandler();
        onSuccess();
      })
      .catch((err) => console.log(err));
  };

  const fetchSelections = useCallback(() => {
    if (visible) {
      http
        .get('/service-types')
        .then(({ data }) => {
          setServiceTypes(data);
          return http.get('/manufacturers');
        })
        .then(({ data }) => {
          setManufacturers(data);
          return http.get('/models');
        })
        .then(({ data }) => {
          setModels(data);
        });
    }
  }, [visible]);

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  return (
    <>
      <Button type="text" onClick={clickedHandler}>
        {children}
      </Button>
      <Modal
        width="100%"
        centered
        maskClosable={false}
        onOk={() => form.submit()}
        visible={visible}
        onCancel={closedHandler}
        title="Create Service"
      >
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name="typeId" label="Service Type">
                <Select onChange={serviceTypeChangedHandler}>
                  {serviceTypes.map((st) => (
                    <Option key={st.id} value={st.id}>
                      {st.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="typeDetailId" label="Section Name">
                <Select disabled={serviceTypeDetails.length === 0}>
                  {serviceTypeDetails.map((std) => (
                    <Option key={std.id} value={std.id}>
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
          <Row gutter={8}>
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
          </Row>
          <Row gutter={8}>
            <Col span={10}>
              <Form.Item label="Available Parts">
                <PartListWithFilters
                  selectedModels={selectedModels}
                  onSelect={partSelectedHandler}
                />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item label="Selected Parts">
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
                {/* {selectedParts.map((part) => (
                  <Row key={part.id} gutter={[8, 8]}>
                    <Col span={16}>{part.name}</Col>
                    <Col span={4}>{part.price}</Col>
                    <Col span={4}>
                      <Button onClick={() => {}}>Remove</Button>
                    </Col>
                  </Row>
                ))} */}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceCreateWithPartsButton;
