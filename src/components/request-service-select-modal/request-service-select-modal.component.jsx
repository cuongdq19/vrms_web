import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import PartsCollectionTable from '../parts-collection-table/parts-collection-table.component';

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
  const [types, setTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [parts, setParts] = useState([]);

  const resetHandler = () => {
    onCancel();
    form.resetFields();
    setParts([]);
    setSelected(null);
    setServices([]);
    setTypes([]);
  };

  const submitHandler = () => {
    onOk(selected);
    resetHandler();
  };

  const addPart = (part) => {
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

  const decreasePartQuantity = (partId) => {
    const updatedParts = [...selected.serviceDetail.parts];
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

  const increasePartQuantity = (partId) => {
    const updatedParts = [...selected.serviceDetail.parts];
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
      http.get('/service-types').then(({ data }) => setTypes(data));
    }
  }, [visible]);

  return (
    <Modal
      width="70%"
      visible={visible}
      onCancel={resetHandler}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={submitHandler} layout="vertical">
        <Row gutter={[8, 8]} align="middle">
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
              <Col span={12}>
                <Form.Item label="Service Type" name="typeId">
                  <Select
                    onChange={(value) => {
                      http
                        .get(`/services/providers/${providerId}/types/${value}`)
                        .then(({ data }) => setServices(data));
                    }}
                    options={types.map((type) => ({
                      label: type.name,
                      value: type.id,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Service" name="serviceId">
                  <Cascader
                    onChange={(_, selectedOptions) => {
                      const [
                        { typeDetail },
                        { serviceDetail },
                      ] = selectedOptions;
                      setSelected({ typeDetail, serviceDetail });
                    }}
                    options={services.map(({ typeDetail, serviceDetails }) => ({
                      label: typeDetail.sectionName,
                      value: typeDetail.id,
                      typeDetail,
                      children: serviceDetails.map((detail) => ({
                        serviceDetail: detail,
                        label: detail.name,
                        value: detail.id,
                      })),
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <PartsCollectionTable
                  showDesc={false}
                  showModels={false}
                  dataSource={selected?.serviceDetail?.parts}
                  columns={[
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      align: 'center',
                      render: (value, record) => (
                        <Row justify="space-between" align="middle">
                          <Button
                            onClick={() => decreasePartQuantity(record.id)}
                          >
                            Remove
                          </Button>
                          <span>{value}</span>
                          <Button
                            onClick={() => increasePartQuantity(record.id)}
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
              <Col span={24}>
                <PartsCollectionTable
                  dataSource={parts}
                  columns={[
                    {
                      title: 'Add To List',
                      align: 'center',
                      render: (_, record) => (
                        <Button onClick={() => addPart(record)}>
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
  providerId: state.auth.userData.providerId,
});

export default connect(mapStateToProps)(RequestServiceSelectModal);
