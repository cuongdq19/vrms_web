import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Radio,
  Row,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import PartsCollectionTable from '../parts-collection-table/parts-collection-table.component';
import { ItemContainer } from './request-service-select-modal.styles';

import http from '../../http';
import { formatMoney } from '../../utils';

const RequestServiceSelectModal = ({
  visible,
  onCancel,
  onOk,
  providerId,
  modelId,
}) => {
  const [form] = Form.useForm();
  const [existed, setExisted] = useState(true);
  const [typeDetails, setTypeDetails] = useState([]);
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [parts, setParts] = useState([]);
  const [serviceFilter, setServiceFilter] = useState(0);

  const resetHandler = () => {
    onCancel();
    form.resetFields();
    setParts([]);
    setSelected(null);
    setServices([]);
    setTypeDetails([]);
  };

  const submitHandler = () => {
    const success = onOk(selected);
    if (success) {
      form.resetFields();
      setParts([]);
      setSelected(null);
      setServices([]);
      setTypeDetails([]);
    }
  };

  const addIncurredPart = (part) => {
    const { id } = part;
    const updatedParts = [...(selected?.parts ?? [])];
    const index = updatedParts.findIndex((part) => part.id === id);
    if (index >= 0) {
      updatedParts[index].quantity++;
    } else {
      updatedParts.push({ ...part, quantity: 1 });
    }
    setSelected((curr) => ({ ...curr, parts: updatedParts }));
  };

  const decreaseServicePartQuantity = (partId) => {
    const updatedParts = [...(selected?.parts ?? [])];
    const index = updatedParts.findIndex((part) => part.id === partId);
    if (index >= 0 && updatedParts[index].quantity > 0) {
      updatedParts[index].quantity--;
    } else {
      return;
    }

    setSelected((curr) => ({
      ...curr,
      typeDetail: { ...curr.typeDetail, parts: updatedParts },
    }));
  };

  const decreaseIncurredPartQuantity = (partId) => {
    const updatedParts = [...(selected?.parts ?? [])];
    const index = updatedParts.findIndex((part) => part.id === partId);
    if (index >= 0) {
      if (updatedParts[index].quantity > 1) {
        updatedParts[index].quantity--;
      } else {
        updatedParts.splice(index, 1);
      }
    } else {
      return;
    }

    setSelected((curr) => ({
      ...curr,
      parts: updatedParts,
    }));
  };

  const increaseServicePartQuantity = (partId) => {
    const updatedParts = [...selected.parts];
    const index = updatedParts.findIndex((part) => part.id === partId);
    if (index >= 0) {
      updatedParts[index].quantity++;
    } else {
      return;
    }

    setSelected((curr) => ({
      ...curr,
      typeDetail: { ...curr.typeDetail, parts: updatedParts },
    }));
  };

  useEffect(() => {
    if (visible) {
      Promise.all([
        http.get('/service-type-details/sections'),
        http.get(`/maintenance-packages/providers/${providerId}/services`),
      ]).then(([typeDetails, services]) => {
        setTypeDetails(typeDetails?.data ?? []);
        setServices(
          services?.data?.filter((service) =>
            service.models.map((m) => m.id).includes(+modelId)
          ) ?? []
        );
      });
    }
  }, [modelId, providerId, visible]);

  return (
    <Modal
      centered
      width="70%"
      visible={visible}
      onCancel={resetHandler}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={submitHandler} layout="vertical">
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Form.Item label="Existed Service">
              <Radio.Group
                value={existed}
                onChange={(event) => {
                  const value = event.target.value;
                  setExisted(event.target.value);
                  if (!value) {
                    http
                      .get(
                        `/parts/provider/${providerId}/vehicle-model/${modelId}`
                      )
                      .then(({ data }) => setParts(data));
                  }
                }}
              >
                <Radio value={true}>True</Radio>
                <Radio value={false}>False</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {existed ? (
            <>
              <Col span={8}>
                <Form.Item label="Service Type" name="id">
                  <Select
                    allowClear
                    onClear={() => setServiceFilter(0)}
                    onChange={(value) => {
                      form.resetFields(['serviceId']);
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
                            onClick={() =>
                              decreaseServicePartQuantity(record.id)
                            }
                          >
                            Remove
                          </Button>
                          <span>{value}</span>
                          <Button
                            onClick={() =>
                              increaseServicePartQuantity(record.id)
                            }
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
          ) : (
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
              <Col span={8}>
                <List
                  header="Service Parts"
                  size="small"
                  bordered
                  dataSource={selected?.parts}
                  renderItem={(item) => (
                    <List.Item>
                      <ItemContainer>
                        <span style={{ flex: 1, margin: 8 }}>{item.name}</span>
                        <span>x {item.quantity}</span>
                        <Button
                          danger
                          onClick={() => {
                            decreaseIncurredPartQuantity(item.id);
                          }}
                        >
                          Remove
                        </Button>
                      </ItemContainer>
                    </List.Item>
                  )}
                />
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
                        <Button onClick={() => addIncurredPart(record)}>
                          Add To List
                        </Button>
                      ),
                    },
                  ]}
                />
              </Col>
            </>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});

export default connect(mapStateToProps)(RequestServiceSelectModal);
