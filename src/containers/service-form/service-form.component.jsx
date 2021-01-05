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

const ServiceForm = ({ providerId, history }) => {
  const {
    location: { state },
  } = history;
  const { item, typeId, typeDetailId } = state ?? {};
  const { id } = item ?? {};
  const filterMessage = 'Parts will be filtered.';
  const [form] = Form.useForm();
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
      http.get(`/parts/${providerId}`).then(({ data }) => setParts(data));
    }
  }, [providerId, withParts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (item) {
      const { parts, price, name } = item;
      setWithParts(parts.length > 0);
      setServiceParts(parts);

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
      <Title>
        <h1>New Service</h1>
        <Button onClick={() => form.submit()}>Submit</Button>
      </Title>
      <Form form={form} layout="vertical" onFinish={submitHandler}>
        <Row wrap gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Service Type">
              <ServiceSelect
                typeId={typeId}
                serviceId={selectedServiceId}
                onChange={(value) => setSelectedServiceId(value)}
              />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item label="Service Name" name="serviceName">
              <Input placeholder="Service Name" />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item label="Models">
              <ModelsSelect
                disabled={withParts}
                models={serviceModels}
                onChange={(modelIds) => setServiceModels(modelIds)}
              />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item name="price" label="Price">
              <InputNumber type="number" min={0} />
            </Form.Item>
          </Col>

          {!id ? (
            <Col span={24}>
              <Form.Item label="With Parts">
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
                <List
                  bordered
                  dataSource={serviceParts}
                  renderItem={(item) => (
                    <List.Item>
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
          {withParts && serviceModels.length > 0 && <h1>{filterMessage}</h1>}
          {!withParts ? null : (
            <PartsCollectionTable
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
    </LayoutWrapper>
  );
};

const mapStateToProps = ({
  auth: {
    userData: { providerId },
  },
}) => ({
  providerId,
});

export default connect(mapStateToProps)(ServiceForm);
