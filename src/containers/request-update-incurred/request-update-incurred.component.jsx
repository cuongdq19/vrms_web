import { Button, Col, message, Row, Switch, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import StateMachine from 'javascript-state-machine';

import http from '../../http';
import { requestStateMachineConfig } from '../../utils/constants';
import { calculateRequestPrice, formatMoney } from '../../utils';

import { Summary } from './request-update-incurred.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import RequestServiceSelectModal from '../../components/request-service-select-modal/request-service-select-modal.component';
import PartsCollectionTable from '../../components/parts-collection-table/parts-collection-table.component';

const RequestUpdateIncurred = () => {
  const { requestId } = useParams();

  const [request, setRequest] = useState(null);
  const [visible, setVisible] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [incurred, setIncurred] = useState([]);
  const [disabled, setDisabled] = useState([]);

  const { services } = request ?? {};
  const requestPrice = request ? calculateRequestPrice(request) : 0;

  const incurredPrice = calculateRequestPrice({ services: incurred });

  const addService = (service) => {
    const updatedIncurred = [...incurred];
    if (service.typeDetail && service.serviceDetail) {
      const { serviceDetail } = service;
      const { id, name, price, parts, ...rest } = serviceDetail;
      const index = updatedIncurred.findIndex(
        (service) => service.serviceId === id
      );
      if (index >= 0) {
        message.info('Service has already been added.');
        return;
      }
      updatedIncurred.push({
        id: Math.random(),
        serviceId: id,
        serviceName: name,
        servicePrice: price,
        parts: parts.map(({ id, name, price, quantity, ...rest }) => ({
          partId: id,
          partName: name,
          price,
          quantity,
          ...rest,
        })),
        ...rest,
      });
    } else {
      const { serviceName, servicePrice, note, parts } = service;
      updatedIncurred.push({
        id: Math.random(),
        serviceId: null,
        serviceName,
        servicePrice,
        note,
        parts: parts.map(({ id, name, price, quantity, ...rest }) => ({
          partId: id,
          partName: name,
          quantity,
          price,
          ...rest,
        })),
      });
    }
    setIncurred(updatedIncurred);
    message.success('Service added.');
    setVisible(false);
  };

  const removeService = (id) => {
    const updatedIncurred = [...incurred];

    const index = updatedIncurred.findIndex((service) => service.id === id);
    if (index < 0) {
      message.info('Service has already been removed.');
      return;
    }
    updatedIncurred.splice(index, 1);
    setRequest((curr) => ({ ...curr, services: updatedIncurred }));
    message.info('Service removed.');
  };

  const toggleService = (id, checked) => {
    const updatedRemovedServices = [...disabled];
    const index = updatedRemovedServices.findIndex((service) => service === id);
    if (!checked) {
      updatedRemovedServices.push(id);
    } else {
      updatedRemovedServices.splice(index, 1);
    }

    setDisabled(updatedRemovedServices);
  };

  const decreasePartQuantity = (incurredId, partId) => {
    const updatedIncurred = [...incurred];
    const incurredIndex = updatedIncurred.findIndex(
      (incurred) => incurred.id === incurredId
    );
    const updatedParts = [...updatedIncurred[incurredIndex].parts];
    const index = updatedParts.findIndex((part) => part.partId === partId);
    if (updatedParts[index].quantity <= 0) {
      return;
    }

    if (updatedParts[index].quantity > 1) {
      updatedParts[index].quantity--;
    } else {
      if (incurredId) {
        updatedParts[index].quantity--;
      } else {
        updatedParts.splice(index, 1);
      }
    }
    updatedIncurred[incurredIndex].parts = updatedParts;
    setIncurred(updatedIncurred);
  };

  const increasePartQuantity = (incurredId, partId) => {
    const updatedIncurred = [...incurred];
    const incurredIndex = updatedIncurred.findIndex(
      (incurred) => incurred.id === incurredId
    );
    const updatedParts = [...updatedIncurred[incurredIndex].parts];
    const index = updatedParts.findIndex((part) => part.partId === partId);
    updatedParts[index].quantity++;

    updatedIncurred[incurredIndex].parts = updatedParts;
    setIncurred(updatedIncurred);
  };

  const submitHandler = () => {
    const incurredExpenses = incurred
      .filter((incurred) => !incurred.serviceId)
      .map((exp) => ({
        name: exp.serviceName,
        note: exp.note,
        parts: exp.parts.reduce((accumulated, item) => {
          return { ...accumulated, [item.partId]: item.quantity };
        }, {}),
        price: exp.servicePrice,
      }));
    const incurredServices = incurred
      .filter((incurred) => incurred.serviceId)
      .reduce((accumulatedIncurred, incurred) => {
        return {
          ...accumulatedIncurred,
          [incurred.serviceId]: incurred.parts.reduce(
            (accumulatedParts, item) => {
              return { ...accumulatedParts, [item.partId]: item.quantity };
            },
            {}
          ),
        };
      }, {});

    const enabled = request.services
      .filter((reqService) => !disabled.includes(reqService.id))
      .map((reqService) => reqService.id);

    http
      .post(`/requests/update/${requestId}`, {
        expenses: incurredExpenses,
        servicePartMap: incurredServices,
        packageMap: {},
        disabled: disabled,
        enabled: enabled,
      })
      .then(({ data }) => {
        message.success('Update request success.');
        setRedirect(true);
      });
  };

  useEffect(() => {
    http.get(`/requests/${requestId}`).then(({ data }) => {
      StateMachine.apply(data, requestStateMachineConfig);
      setRequest(data);
    });
  }, [requestId]);

  const columns = [
    { title: 'ID', align: 'center', render: (_, record, index) => index + 1 },
    { title: 'Service Name', dataIndex: 'serviceName', align: 'center' },
    {
      title: 'Price',
      dataIndex: 'servicePrice',
      align: 'center',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Incurred',
      dataIndex: 'isIncurred',
      align: 'center',
      render: (value) => (
        <Tag color={value ? 'success' : 'error'}>
          {value.toString().toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Active',
      align: 'center',
      render: (_, record) => {
        return (
          <Switch
            checked={!disabled.includes(record.id)}
            onChange={(checked) => toggleService(record.id, checked)}
          />
        );
      },
    },
  ];

  if (redirect) {
    return <Redirect to="/requests" />;
  }

  return (
    <LayoutWrapper>
      <Row justify="space-between" align="middle" gutter={[8, 8]}>
        <h1>Update Request</h1>
        <Button type="primary" onClick={submitHandler}>
          Submit
        </Button>

        <Col span={24}>
          <Table
            title={() => <h1>Confirmed Services</h1>}
            size="large"
            rowKey="id"
            dataSource={services}
            columns={columns}
            expandable={{
              rowExpandable: (record) => record.parts.length > 0,
              expandedRowRender: (record) => {
                return (
                  <PartsCollectionTable
                    showDesc={false}
                    showModels={false}
                    dataSource={record.parts.map(
                      ({ partId, partName, price, quantity, ...rest }) => ({
                        id: partId,
                        name: partName,
                        price,
                        quantity,
                        ...rest,
                      })
                    )}
                    columns={[
                      {
                        title: 'Quantity',
                        dataIndex: 'quantity',
                        align: 'center',
                      },
                      {
                        title: 'Total Price',
                        align: 'center',
                        render: (_, record) =>
                          formatMoney(record.price * record.quantity),
                      },
                    ]}
                  />
                );
              },
            }}
          />
        </Col>
        <Col span={24}>
          <Button onClick={() => setVisible(true)}>Add Service</Button>
        </Col>
        <Col span={24}>
          <Table
            title={() => <h1>Incurred Services</h1>}
            size="large"
            rowKey="id"
            dataSource={incurred}
            columns={columns}
            expandable={{
              rowExpandable: (record) => record.parts.length > 0,
              expandedRowRender: (record) => {
                const { id } = record;

                return (
                  <PartsCollectionTable
                    showDesc={false}
                    showModels={false}
                    dataSource={record.parts.map(
                      ({ partId, partName, price, quantity, ...rest }) => ({
                        id: partId,
                        name: partName,
                        price,
                        quantity,
                        ...rest,
                      })
                    )}
                    columns={[
                      {
                        title: 'Quantity',
                        dataIndex: 'quantity',
                        align: 'center',
                        render: (value, record) => {
                          return (
                            <Row
                              align="middle"
                              justify="space-between"
                              gutter={[8, 8]}
                            >
                              <Button
                                onClick={() =>
                                  decreasePartQuantity(id, record.id)
                                }
                              >
                                Remove
                              </Button>
                              <span>{value}</span>
                              <Button
                                onClick={() =>
                                  increasePartQuantity(id, record.id)
                                }
                              >
                                Add
                              </Button>
                            </Row>
                          );
                        },
                      },
                      {
                        title: 'Total Price',
                        align: 'center',
                        render: (_, record) =>
                          formatMoney(record.price * record.quantity),
                      },
                    ]}
                  />
                );
              },
            }}
          />
        </Col>
        <Col span={8} offset={16}>
          <Summary justify="end" align="middle" gutter={[8, 8]}>
            <Col span={6}>
              <span>Services: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(requestPrice.total)}</h3>
            </Col>
            <Col span={6}>
              <span>Incurred: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(incurredPrice.total)}</h3>
            </Col>
            <Col span={6}>
              <span>Total: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(requestPrice.total + incurredPrice.total)}</h3>
            </Col>
          </Summary>
        </Col>
      </Row>
      <RequestServiceSelectModal
        modelId="1"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={addService}
      />
    </LayoutWrapper>
  );
};

export default RequestUpdateIncurred;
