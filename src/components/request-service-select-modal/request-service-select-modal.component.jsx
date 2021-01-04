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
  const [selected, setSelected] = useState({
    serviceId: null,
    serviceName: '',
    servicePrice: '',
    note: '',
    parts: [],
  });
  const [parts, setParts] = useState([]);

  const reset = () => {
    setParts([]);
    setSelected({
      serviceId: null,
      serviceName: '',
      servicePrice: '',
      note: '',
      parts: [],
    });
    setServices([]);
    setTypes([]);
  };

  const addPart = (part) => {
    const { id } = part;
    const updatedParts = [...selected.parts];
    const index = updatedParts.findIndex((part) => part.id === id);
    if (index >= 0) {
      updatedParts[index].quantity++;
    } else {
      updatedParts.push({ ...part, quantity: 1 });
    }
    setSelected((curr) => ({ ...curr, parts: updatedParts }));
  };

  useEffect(() => {
    http.get('/service-types').then(({ data }) => setTypes(data));
  }, []);

  return (
    <Modal
      width="60%"
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        onFinish={() => {
          onOk(selected);
          reset();
        }}
        layout="vertical"
      >
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
                <Form.Item label="Service Type">
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
                <Form.Item label="Service">
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
            </>
          ) : (
            <>
              <Col span={8}>
                <Form.Item label="Service Name">
                  <Input
                    placeholder="Service Name"
                    value={selected.serviceName}
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
                    value={selected.note}
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
                    value={selected.servicePrice}
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
