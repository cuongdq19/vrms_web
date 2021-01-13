import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Radio,
  Row,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { ItemContainer, NameContainer, Title } from './service-form.styles';
import http from '../../http';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ModelsSelect from '../../components/models-select/models-select.component';
import PartsCollectionTable from '../../components/parts-collection-table/parts-collection-table.component';
import ServiceSelect from '../../components/service-select/service-select.component';

const partFilteredMessage = {
  description:
    'Parts will be filtered based on the models that the first part applied!',
  title: 'Part list is filtered!',
};

const ServiceForm = ({ providerId, history }) => {
  const {
    location: { state },
  } = history;
  const { item, typeId, typeDetailId } = state ?? {};

  const { id } = item ?? {};

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [withParts, setWithParts] = useState(false);
  const [serviceParts, setServiceParts] = useState([]);
  const [serviceModels, setServiceModels] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(
    typeDetailId ?? null
  );
  const [redirect, setRedirect] = useState(false);

  const addServicePart = (part) => {
    if (serviceParts.length === 0) {
      const modelIds = part.models.map((m) => m.id);
      setServiceModels(modelIds);
      form.setFieldsValue({ modelIds });
    }

    const { id } = part;

    const updatedServiceParts = [...serviceParts];
    const index = updatedServiceParts.findIndex((part) => part.id === id);

    if (index >= 0) {
      updatedServiceParts[index].quantity++;
    } else {
      updatedServiceParts.push({ ...part, quantity: 1 });
    }

    setServiceParts(updatedServiceParts);
  };

  const removeServicePart = (partId) => {
    const updatedServiceParts = [...serviceParts];
    const index = updatedServiceParts.findIndex((part) => part.id === partId);

    if (index >= 0) {
      if (updatedServiceParts[index].quantity > 1) {
        updatedServiceParts[index].quantity--;
      } else {
        updatedServiceParts.splice(index, 1);
      }
    } else {
      return;
    }

    if (updatedServiceParts.length === 0) {
      form.setFieldsValue({ modelIds: [] });
      setServiceModels([]);
    }

    setServiceParts(updatedServiceParts);
  };

  const submitHandler = (values) => {
    const { serviceName, price } = values;

    if (serviceParts.length === 0) {
      const requestBody = {
        typeDetailId: selectedServiceId,
        modelIds: serviceModels,
        serviceName,
        price,
      };
      if (!id) {
        http
          .post(`/services/providers/${providerId}/non-replacing`, requestBody)
          .then(({ data }) => {
            message.success('Service successfully created.');
            setRedirect(true);
          });
      } else {
        http
          .post(`/services/${id}/non-replacing`, requestBody)
          .then(({ data }) => {
            message.success('Service successfully updated.');
            setRedirect(true);
          });
      }
    } else {
      if (!serviceParts.every((part) => !part.isDeleted)) {
        return;
      }
      const groupPriceRequest = {
        name: serviceName,
        price,
        partQuantity: serviceParts.reduce((accumulatedPart, item) => {
          return {
            ...accumulatedPart,
            [item.id]: item.quantity,
          };
        }, {}),
      };

      if (!id) {
        const requestBody = {
          typeDetailId: selectedServiceId,
          groupPriceRequest,
        };
        http
          .post(`/services/providers/${providerId}/replacing`, requestBody)
          .then(({ data }) => {
            message.success('Service successfully created.');
            setRedirect(true);
          });
      } else {
        http
          .post(`/services/${id}/replacing`, groupPriceRequest)
          .then(({ data }) => {
            message.success('Service successfully updated.');
            setRedirect(true);
          });
      }
    }
  };

  const loadData = useCallback(() => {
    if (withParts) {
      setLoading(true);
      http.get(`/parts/${providerId}`).then(({ data }) => {
        setParts(data);
        setLoading(false);
      });
    }
  }, [providerId, withParts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (item) {
      const { parts, price, name, models } = item;
      setWithParts(parts.length > 0);
      setServiceParts(
        parts.map(({ partId, partName, ...rest }) => ({
          id: partId,
          name: partName,
          ...rest,
        }))
      );
      setServiceModels(models.map((m) => m.id));

      form.setFieldsValue({
        price,
        serviceName: name,
      });
    }
  }, [form, item, typeDetailId, typeId]);

  const filteredParts = parts.filter((part) => {
    if (serviceModels.length === 0) {
      return true;
    }
    const modelIds = part.models.map((m) => m.id);
    return serviceModels.every((el) => modelIds.includes(el));
  });

  if (redirect) {
    return <Redirect to="/services" />;
  }

  return (
    <LayoutWrapper>
      <>
        <Title>
          <h1>New Service</h1>
          <Button onClick={() => form.submit()}>Submit</Button>
        </Title>
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Row wrap gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                label="Service Type"
                name="typeDetailId"
                rules={[
                  ({ getFieldValue }) => ({
                    validator() {
                      if (selectedServiceId > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Service type can't be blank");
                    },
                  }),
                ]}
              >
                <ServiceSelect
                  typeId={typeId}
                  serviceId={selectedServiceId}
                  onChange={(value) => setSelectedServiceId(value)}
                />
              </Form.Item>
            </Col>
            <Col flex="1">
              <Form.Item
                label="Service Name"
                name="serviceName"
                rules={[
                  { required: true, message: "Service name can't be blank" },
                ]}
              >
                <Input placeholder="Service Name" />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item
                label="Models"
                name="modelIds"
                rules={[
                  ({ getFieldValue }) => ({
                    validator() {
                      if (serviceModels.length > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Models can't be blank");
                    },
                  }),
                ]}
              >
                <ModelsSelect
                  disabled={withParts}
                  models={serviceModels}
                  onChange={(modelIds) => setServiceModels(modelIds)}
                />
              </Form.Item>
            </Col>
            <Col flex="1">
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Price can't be blank" }]}
              >
                <InputNumber type="number" min={0} />
              </Form.Item>
            </Col>

            {!id ? (
              <Col span={24}>
                <Form.Item
                  label="With Parts"
                  name="withParts"
                  initialValue={withParts}
                  validateTrigger={[]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator() {
                        if (withParts && serviceParts.length > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Parts can't be blank");
                      },
                    }),
                  ]}
                >
                  <Radio.Group
                    value={withParts}
                    onChange={(event) => {
                      setWithParts(event.target.value);
                      setServiceParts([]);
                      setServiceModels([]);
                    }}
                  >
                    <Radio value={true}>With Parts</Radio>
                    <Radio value={false}>Without Parts</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            ) : null}
            {withParts && serviceParts.length > 0 ? (
              <Col span={24}>
                <Form.Item label="Service Parts">
                  <Input hidden />
                  <List
                    bordered
                    dataSource={serviceParts}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          ...(item.isDeleted
                            ? { backgroundColor: 'salmon' }
                            : {}),
                        }}
                      >
                        <ItemContainer>
                          <NameContainer>
                            <span>{item.name}</span>
                          </NameContainer>
                          <NameContainer>x {item.quantity}</NameContainer>
                          <Button
                            danger
                            onClick={() => removeServicePart(item.id)}
                          >
                            Remove
                          </Button>
                        </ItemContainer>
                      </List.Item>
                    )}
                  />
                </Form.Item>
              </Col>
            ) : null}
            {withParts && serviceModels.length > 0 && (
              <Alert
                type="info"
                showIcon
                {...partFilteredMessage}
                style={{ width: '100%' }}
              />
            )}
            {!withParts ? null : (
              <PartsCollectionTable
                loading={loading}
                showDefaultQuantity={false}
                columns={[
                  {
                    title: 'Add',
                    align: 'center',
                    render: (_, record) => {
                      return (
                        <Button onClick={() => addServicePart(record)}>
                          Add To List
                        </Button>
                      );
                    },
                  },
                ]}
                dataSource={filteredParts}
              />
            )}
          </Row>
        </Form>
      </>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});

export default connect(mapStateToProps)(ServiceForm);
