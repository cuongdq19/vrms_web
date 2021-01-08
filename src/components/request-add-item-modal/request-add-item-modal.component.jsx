import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Radio,
  Row,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import PackagesCollectionTable from '../packages-collection-table/packages-collection-table.component';
import PartsCollectionTable from '../parts-collection-table/parts-collection-table.component';

import http from '../../http';
import { formatMoney } from '../../utils';
import { ITEM_TYPES } from '../../utils/constants';
import CustomModal from '../custom-modal/custom-modal.component';

const RequestAddItemModal = ({
  visible,
  providerId,
  modelId,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [type, setType] = useState(-1);
  const [selected, setSelected] = useState(null);
  const [packages, setPackages] = useState([]);
  const [parts, setParts] = useState([]);
  const [typeDetails, setTypeDetails] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceFilter, setServiceFilter] = useState(0);

  const resetHandler = () => {
    onCancel();
    form.resetFields();
    setType(-1);
    setSelected(null);
    setPackages([]);
    setParts([]);
    setTypeDetails([]);
    setServices([]);
    setServiceFilter(0);
  };

  const submitHandler = () => {
    const success = onSubmit(selected, type);
    if (success) {
      message.success('Added successfully');
      resetHandler();
    }
  };

  const expensePartAddedHandler = ({ id, ...rest }) => {
    const updatedParts = [...(selected?.parts ?? [])];
    const index = updatedParts.findIndex((part) => part.id === id);
    if (index < 0) {
      updatedParts.push({ id, ...rest, quantity: 1 });
    } else {
      updatedParts[index].quantity++;
    }
    setSelected((curr) => ({ ...curr, parts: updatedParts }));
  };

  const expensePartRemovedHandler = (id) => {
    const updatedParts = [...(selected?.parts ?? [])];
    const index = updatedParts.findIndex((part) => part.id === id);
    if (index < 0) {
      return;
    }
    if (updatedParts[index].quantity > 1) {
      updatedParts[index].quantity--;
    } else {
      updatedParts.splice(index, 1);
    }
    setSelected((curr) => ({ ...curr, parts: updatedParts }));
  };

  const servicePartRemovedHandler = (partId) => {
    const updatedParts = [...(selected?.parts ?? [])];
    const index = updatedParts.findIndex((p) => p.id === partId);
    if (updatedParts[index] < 0) {
      return;
    }
    if (updatedParts[index].quantity <= 0) {
      return;
    }
    updatedParts[index].quantity--;
    setSelected((curr) => ({ ...curr, parts: updatedParts }));
  };

  const servicePartAddedHandler = (partId) => {
    const updatedParts = [...(selected?.parts ?? [])];
    const index = updatedParts.findIndex((p) => p.id === partId);
    if (updatedParts[index] < 0) {
      return;
    }
    updatedParts[index].quantity++;

    setSelected((curr) => ({ ...curr, parts: updatedParts }));
  };

  useEffect(() => {
    setSelected(null);
    switch (type) {
      case ITEM_TYPES.existed:
        return Promise.all([
          http.get('/service-type-details/sections'),
          http.get(`/maintenance-packages/providers/${providerId}/services`),
        ]).then(([typeDetails, services]) => {
          setTypeDetails(typeDetails?.data ?? []);
          setServices(
            services?.data?.filter((service) =>
              service.models.map((m) => m.id).includes(modelId)
            ) ?? []
          );
        });
      case ITEM_TYPES.package:
        return http
          .get(
            `/maintenance-packages/providers/${providerId}/models/${modelId}`
          )
          .then(({ data }) => {
            const packages = data.map(({ packagedServices, ...rest }) => ({
              services: packagedServices,
              ...rest,
            }));
            setPackages(packages);
          });
      case ITEM_TYPES.expense:
        return http
          .get(`/parts/provider/${providerId}/vehicle-model/${modelId}`)
          .then(({ data }) => setParts(data));
      default:
        return;
    }
  }, [form, modelId, providerId, type]);

  return (
    <CustomModal
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={submitHandler}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Form.Item label="Existed Service">
              <Radio.Group
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                }}
              >
                <Radio value={ITEM_TYPES.existed}>Existed</Radio>
                <Radio value={ITEM_TYPES.expense}>Expense</Radio>
                <Radio value={ITEM_TYPES.package}>Package</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {type === ITEM_TYPES.package ? (
            <Col span={24}>
              <PackagesCollectionTable
                rowKey="id"
                dataSource={packages}
                columns={[
                  {
                    title: '',
                    align: 'center',
                    render: (_, record) => {
                      return (
                        <Radio
                          onChange={() => setSelected(record)}
                          checked={selected?.id === record.id}
                          value={record.id}
                        />
                      );
                    },
                  },
                ]}
              />
            </Col>
          ) : null}
          {type === ITEM_TYPES.expense ? (
            <>
              <Col span={8}>
                <Form.Item label="Service Name">
                  <Input
                    placeholder="Service Name"
                    value={selected?.serviceName}
                    onChange={(event) =>
                      setSelected((curr) => ({
                        ...curr,
                        serviceName: event.target.value,
                      }))
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Note">
                  <Input.TextArea
                    autoSize
                    placeholder="Note"
                    value={selected?.note}
                    onChange={(event) =>
                      setSelected((curr) => ({
                        ...curr,
                        note: event.target.value,
                      }))
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Price">
                  <InputNumber
                    type="number"
                    min={0}
                    value={selected?.servicePrice}
                    onChange={(value) =>
                      setSelected((curr) => ({
                        ...curr,
                        servicePrice: value,
                      }))
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={16}>
                <PartsCollectionTable
                  size="small"
                  showDesc={false}
                  showModels={false}
                  showDefaultQuantity={false}
                  dataSource={parts}
                  columns={[
                    {
                      title: 'Add To List',
                      align: 'center',
                      render: (_, record) => (
                        <Button
                          onClick={() => {
                            expensePartAddedHandler(record);
                          }}
                        >
                          Add To List
                        </Button>
                      ),
                    },
                  ]}
                />
              </Col>
              <Col span={8}>
                <List
                  header="Service Parts"
                  size="small"
                  bordered
                  dataSource={selected?.parts}
                  renderItem={(item) => (
                    <List.Item>
                      {item.name} x {item.quantity}
                      <Button
                        danger
                        onClick={() => {
                          expensePartRemovedHandler(item.id);
                        }}
                      >
                        Remove
                      </Button>
                    </List.Item>
                  )}
                />
              </Col>
            </>
          ) : null}
          {type === ITEM_TYPES.existed ? (
            <>
              <Col span={8}>
                <Form.Item label="Service Type" name="id">
                  <Select
                    allowClear
                    onClear={() => setServiceFilter(0)}
                    onChange={(value) => {
                      form.resetFields(['serviceId']);
                      setSelected(null);
                      setServiceFilter(value);
                    }}
                    options={typeDetails.map((type) => ({
                      label: type.typeName + ' ' + type.sectionName,
                      value: type.id,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col flex="1">
                <Form.Item label="Service" name="serviceId">
                  <Select
                    onChange={(value, option) => setSelected(option.service)}
                    options={services
                      .filter(({ typeDetail }) => {
                        return serviceFilter > 0
                          ? serviceFilter === typeDetail.id
                          : true;
                      })
                      .map((service) => {
                        const { id, name } = service;
                        return {
                          label: name,
                          value: id,
                          service,
                        };
                      })}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <PartsCollectionTable
                  showDefaultQuantity={false}
                  showDesc={false}
                  showModels={false}
                  dataSource={selected?.parts}
                  columns={[
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      align: 'center',
                      render: (value, record) => (
                        <Row justify="space-between" align="middle">
                          <Button
                            onClick={() => {
                              servicePartRemovedHandler(record.id);
                            }}
                          >
                            Remove
                          </Button>
                          <span>{value}</span>
                          <Button
                            onClick={() => {
                              servicePartAddedHandler(record.id);
                            }}
                          >
                            Add
                          </Button>
                        </Row>
                      ),
                    },
                    {
                      title: 'Total Price',
                      align: 'center',
                      render: (_, record) =>
                        formatMoney(record.price * record.quantity),
                    },
                  ]}
                />
              </Col>
            </>
          ) : null}
        </Row>
      </Form>
    </CustomModal>
  );
};

const mapStateToProps = (state) => {
  return {
    providerId: state.auth?.userData?.providerId,
  };
};

export default connect(mapStateToProps)(RequestAddItemModal);
