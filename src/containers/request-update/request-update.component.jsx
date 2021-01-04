import { Button, Col, message, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import RequestServiceSelectModal from '../../components/request-service-select-modal/request-service-select-modal.component';
import http from '../../http';
import { calculateRequestPrice, formatMoney } from '../../utils';
import { Summary } from './request-update.styles';

const RequestUpdate = () => {
  const { requestId } = useParams();

  const [request, setRequest] = useState(null);
  const [visible, setVisible] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const { services } = request ?? {};

  const total = request ? calculateRequestPrice(request) : 0;

  const addService = (service) => {
    if (service.serviceId > 0) {
      const updatedServices = [...request.services];

      const { serviceDetail } = service;
      const { id, name, price, ...rest } = serviceDetail;
      const index = updatedServices.findIndex(
        (service) => service.serviceId === id
      );
      if (index >= 0) {
        message.info('Service has already been added.');
        return;
      }
      updatedServices.push({
        id: Math.random(),
        serviceId: id,
        serviceName: name,
        servicePrice: price,
        ...rest,
      });
      setRequest((curr) => ({ ...curr, services: updatedServices }));
      message.success('Service added.');
    } else {
      const updatedServices = [...request.services];
      const { serviceId, serviceName, servicePrice, note, parts } = service;

      updatedServices.push({
        id: Math.random(),
        serviceId,
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
      setRequest((curr) => ({ ...curr, services: updatedServices }));
      message.success('Service added.');
    }

    setVisible(false);
  };

  const removeService = (serviceId) => {
    const updatedServices = [...request.services];

    const index = updatedServices.findIndex(
      (service) => service.serviceId === serviceId
    );
    if (index >= 0) {
      message.info('Service has already been removed.');
      return;
    }
    updatedServices.splice(index, 1);
    setRequest((curr) => ({ ...curr, services: updatedServices }));
    message.info('Service removed.');
  };

  const decreasePartQuantity = (id, serviceId, partId) => {
    const updatedServices = [...request.services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.id === id
    );
    const updatedParts = [...updatedServices[serviceIndex].parts];
    const index = updatedParts.findIndex((part) => part.partId === partId);
    if (updatedParts[index].quantity <= 0) {
      return;
    }

    if (updatedParts[index].quantity > 1) {
      updatedParts[index].quantity--;
    } else {
      if (serviceId) {
        updatedParts[index].quantity--;
      } else {
        updatedParts.splice(index, 1);
      }
    }
    updatedServices[serviceIndex].parts = updatedParts;
    setRequest((curr) => ({ ...curr, services: updatedServices }));
  };

  const increasePartQuantity = (id, serviceId, partId) => {
    const updatedServices = [...request.services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.id === id
    );
    const updatedParts = [...updatedServices[serviceIndex].parts];
    const index = updatedParts.findIndex((part) => part.partId === partId);
    updatedParts[index].quantity++;

    updatedServices[serviceIndex].parts = updatedParts;
    setRequest((curr) => ({ ...curr, services: updatedServices }));
  };

  const submitHandler = () => {
    const { services } = request;
    const reqExpenses = services
      .filter((service) => !service.serviceId)
      .map((exp) => ({
        name: exp.serviceName,
        note: exp.note,
        parts: exp.parts.reduce((accumulated, item) => {
          return { ...accumulated, [item.partId]: item.quantity };
        }, {}),
        price: exp.servicePrice,
      }));
    const reqServices = services
      .filter((service) => service.serviceId)
      .reduce((accumulatedServices, service) => {
        return {
          ...accumulatedServices,
          [service.serviceId]: service.parts.reduce(
            (accumulatedParts, item) => {
              return { ...accumulatedParts, [item.partId]: item.quantity };
            },
            {}
          ),
        };
      }, {});

    http
      .post(`/requests/update/${requestId}`, {
        expenses: reqExpenses,
        servicePartMap: reqServices,
        packageMap: {},
      })
      .then(({ data }) => {
        message.success('Update request success.');
        setRedirect(true);
      });
  };

  useEffect(() => {
    http.get(`/requests/${requestId}`).then(({ data }) => setRequest(data));
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
      title: 'Remove',
      align: 'center',
      render: (_, record) => (
        <Button danger onClick={() => removeService(record.id)}>
          Remove
        </Button>
      ),
    },
  ];

  if (redirect) {
    return <Redirect to="/requests" />;
  }

  return (
    <LayoutWrapper>
      <Row justify="space-between" align="middle" gutter={[8, 8]}>
        <h1>Update Request</h1>
        <Button onClick={() => setVisible(true)}>Add Service</Button>
        <Col span={24}>
          <Table
            rowKey="id"
            dataSource={services}
            columns={columns}
            expandable={{
              rowExpandable: (record) => record.parts.length > 0,
              expandedRowRender: (record) => {
                const { id, serviceId } = record;
                return (
                  <Table
                    dataSource={record.parts}
                    columns={[
                      { title: 'ID', dataIndex: 'partId', align: 'center' },
                      { title: 'Name', dataIndex: 'partName', align: 'center' },
                      {
                        title: 'Price',
                        dataIndex: 'price',
                        align: 'center',
                        render: (value) => formatMoney(value),
                      },
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
                                  decreasePartQuantity(
                                    id,
                                    serviceId,
                                    record.partId
                                  )
                                }
                              >
                                Remove
                              </Button>
                              <span>{value}</span>
                              <Button
                                onClick={() =>
                                  increasePartQuantity(
                                    id,
                                    serviceId,
                                    record.partId
                                  )
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
                    rowKey="partId"
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
              <h3>{formatMoney(total.services)}</h3>
            </Col>
            <Col span={6}>
              <span>Total: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(total.total)}</h3>
            </Col>
          </Summary>
        </Col>
        <Col flex="1"></Col>
        <Button onClick={submitHandler}>Submit</Button>
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

export default RequestUpdate;
