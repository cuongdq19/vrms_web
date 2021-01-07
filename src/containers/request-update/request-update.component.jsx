import { Button, Col, message, Popconfirm, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import StateMachine from 'javascript-state-machine';
import { WarningOutlined } from '@ant-design/icons';

import http from '../../http';
import { calculateRequestPrice, formatMoney } from '../../utils';
import { requestStateMachineConfig, ITEM_TYPES } from '../../utils/constants';
import { Summary } from './request-update.styles';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ServicesCollectionTable from '../../components/services-collection-table/services-collection-table.component';
import RequestAddItemModal from '../../components/request-add-item-modal/request-add-item-modal.component';

const RequestUpdate = () => {
  const { requestId } = useParams();

  const [item, setItem] = useState(null);
  const [visible, setVisible] = useState(false);
  const [redirect, setRedirect] = useState(null);

  const { services = [], packages = [], user } = item ?? {};
  const total = item ? calculateRequestPrice({ services, packages }) : 0;

  const itemAddedHandler = (newItem, type) => {
    if (type === ITEM_TYPES.package) {
      const updatedPackages = [...item.packages];
      const index = updatedPackages.findIndex(
        (p) => p.packageId === newItem.id
      );

      if (index >= 0) {
        message.info('Package is already added.');
        return;
      }

      updatedPackages.push({
        packageId: newItem.id,
        packageName: newItem.name,
        sectionId: newItem.sectionId,
        sectionName: newItem.sectionName,
        services: newItem.services.map(
          ({ id, name, price, parts, ...rest }) => ({
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
          })
        ),
      });
      setItem((curr) => ({ ...curr, packages: updatedPackages }));
      return true;
    }
    if (type === ITEM_TYPES.expense) {
      const updatedServices = [...item.services];

      updatedServices.push({
        id: Math.random(),
        serviceId: null,
        serviceName: newItem.serviceName,
        servicePrice: newItem.servicePrice,
        note: newItem.note,
        parts: newItem.parts.map(({ id, name, price, quantity, ...rest }) => ({
          partId: id,
          partName: name,
          quantity,
          price,
          ...rest,
        })),
      });
      setItem((curr) => ({ ...curr, services: updatedServices }));
      return true;
    }
    if (type === ITEM_TYPES.existed) {
      const updatedServices = [...item.services];
      const index = updatedServices.findIndex(
        (service) => service.serviceId === newItem.id
      );

      if (index >= 0) {
        message.info('Service has already been added.');
        return false;
      }
      updatedServices.push({
        id: Math.random(),
        serviceId: newItem.id,
        serviceName: newItem.name,
        servicePrice: newItem.price,
        parts: newItem.parts.map(({ id, name, price, quantity }) => ({
          partId: id,
          partName: name,
          price,
          quantity,
        })),
      });
      setItem((curr) => ({ ...curr, services: updatedServices }));
      return true;
    }
    return;
  };

  const removeService = (id) => {
    const updatedServices = [...item.services];

    const index = updatedServices.findIndex((service) => service.id === id);
    if (index < 0) {
      message.info('Service has already been removed.');
      return;
    }
    updatedServices.splice(index, 1);
    setItem((curr) => ({ ...curr, services: updatedServices }));
    message.info('Service removed.');
  };

  const decreasePartQuantity = (id, serviceId, partId) => {
    const updatedServices = [...item.services];
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
    setItem((curr) => ({ ...curr, services: updatedServices }));
  };

  const increasePartQuantity = (id, serviceId, partId) => {
    const updatedServices = [...item.services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.id === id
    );
    const updatedParts = [...updatedServices[serviceIndex].parts];
    const index = updatedParts.findIndex((part) => part.partId === partId);
    updatedParts[index].quantity++;

    updatedServices[serviceIndex].parts = updatedParts;
    setItem((curr) => ({ ...curr, services: updatedServices }));
  };

  const partQuantityServicePackageIncreasedHandler = (
    packageId,
    serviceId,
    partId
  ) => {
    const updatedPackages = [...packages];
    const packageIndex = updatedPackages.findIndex(
      (p) => p.packageId === packageId
    );
    if (packageIndex < 0) {
      return;
    }

    const updatedServices = [...updatedPackages[packageIndex].services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.serviceId === serviceId
    );
    if (serviceIndex < 0) {
      return;
    }
    const updatedParts = [...updatedServices[serviceIndex].parts];

    const partIndex = updatedParts.findIndex((part) => part.partId === partId);
    if (partIndex < 0) {
      return;
    }

    updatedParts[partIndex].quantity++;
    updatedServices[serviceIndex].parts = updatedParts;
    updatedPackages[packageIndex].services = updatedServices;

    setItem((curr) => ({ ...curr, packages: updatedPackages }));
  };

  const partQuantityServicePackageDecreasedHandler = (
    packageId,
    serviceId,
    partId
  ) => {
    const updatedPackages = [...packages];
    const packageIndex = updatedPackages.findIndex(
      (p) => p.packageId === packageId
    );
    if (packageIndex < 0) {
      return;
    }

    const updatedServices = [...updatedPackages[packageIndex].services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.serviceId === serviceId
    );
    if (serviceIndex < 0) {
      return;
    }
    const updatedParts = [...updatedServices[serviceIndex].parts];

    const partIndex = updatedParts.findIndex((part) => part.partId === partId);
    if (partIndex < 0) {
      return;
    }

    if (updatedParts[partIndex].quantity <= 0) {
      return;
    }

    updatedParts[partIndex].quantity--;
    updatedServices[serviceIndex].parts = updatedParts;
    updatedPackages[packageIndex].services = updatedServices;

    setItem((curr) => ({ ...curr, packages: updatedPackages }));
  };

  const serviceRemovedFromPackageHandler = (packageId, serviceId) => {
    const updatedPackages = [...packages];
    const packageIndex = updatedPackages.findIndex(
      (p) => p.packageId === packageId
    );
    if (packageIndex >= 0) {
      const updatedServices = [...updatedPackages[packageIndex].services];
      const serviceIndex = updatedServices.findIndex(
        (service) => service.serviceId === serviceId
      );
      updatedServices.splice(serviceIndex, 1);
      updatedPackages[packageIndex].services = updatedServices;
      setItem((curr) => ({ ...curr, packages: updatedPackages }));
    }
  };

  const submitHandler = () => {
    const { services, packages } = item;

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

    const reqPackages = packages.reduce((accumulatedPackages, currPackage) => {
      return {
        ...accumulatedPackages,
        [currPackage.packageId]: currPackage.services.reduce(
          (accumulatedServices, currService) => {
            return {
              ...accumulatedServices,
              [currService.serviceId]: currService.parts.reduce(
                (accumulatedParts, currParts) => {
                  return {
                    ...accumulatedParts,
                    [currParts.partId]: currParts.quantity,
                  };
                },
                {}
              ),
            };
          },
          {}
        ),
      };
    }, {});

    http
      .post(`/requests/update/${requestId}`, {
        expenses: reqExpenses,
        servicePartMap: reqServices,
        packageMap: reqPackages,
        disables: [],
        enables: [],
      })
      .then(({ data }) => {
        message.success('Update request success.');
        setRedirect(true);
      });
  };

  useEffect(() => {
    http.get(`/requests/${requestId}`).then(({ data }) => {
      StateMachine.apply(data, requestStateMachineConfig);
      setItem(data);
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
        <Button type="primary" onClick={submitHandler}>
          Submit
        </Button>
        <Col span={24}>
          <Button onClick={() => setVisible(true)}>Add Service</Button>
        </Col>
        <Col span={24}>
          <Table
            size="large"
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
        <Col span={24}>
          <Col span={24}>
            <Button onClick={() => setVisible(true)}>Add Package</Button>
          </Col>
          <Table
            dataSource={packages}
            rowKey="packageId"
            columns={[
              { title: 'ID', dataIndex: 'packageId', align: 'center' },
              { title: 'Name', dataIndex: 'packageName', align: 'center' },
              {
                title: 'Milestone',
                dataIndex: 'milestone',
                align: 'center',
                render: (value) => value ?? 'N/A',
              },
              {
                title: 'Section Name',
                dataIndex: 'sectionName',
                align: 'center',
                render: (value) => value ?? 'N/A',
              },
            ]}
            expandable={{
              rowExpandable: ({ services = [] }) => services.length > 0,
              expandedRowRender: ({ packageId, services = [] }) => {
                const dataSource = services.map(
                  ({ serviceId, serviceName, servicePrice, parts }) => ({
                    packageId,
                    id: serviceId,
                    name: serviceName,
                    price: servicePrice,
                    parts: parts.map(({ id, partId, partName, ...rest }) => ({
                      packageId,
                      id: partId,
                      name: partName,
                      ...rest,
                    })),
                  })
                );
                return (
                  <ServicesCollectionTable
                    showDefaultQuantity={false}
                    rowKey="id"
                    dataSource={dataSource}
                    columns={[
                      {
                        title: 'Remove',
                        align: 'center',
                        render: (_, record) => {
                          return (
                            <Popconfirm
                              placement="top"
                              icon={
                                <WarningOutlined style={{ color: 'red' }} />
                              }
                              title="Are you sure to remove this service? This can't be undone!"
                              onConfirm={() => {
                                serviceRemovedFromPackageHandler(
                                  record.packageId,
                                  record.id
                                );
                              }}
                            >
                              <Button danger>Remove</Button>
                            </Popconfirm>
                          );
                        },
                      },
                    ]}
                    partsExpandedColumns={[
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
                                onClick={() => {
                                  partQuantityServicePackageDecreasedHandler(
                                    record.packageId,
                                    record.serviceId,
                                    record.id
                                  );
                                }}
                              >
                                Remove
                              </Button>
                              <span>{value}</span>
                              <Button
                                onClick={() => {
                                  partQuantityServicePackageIncreasedHandler(
                                    record.packageId,
                                    record.serviceId,
                                    record.id
                                  );
                                }}
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
      </Row>
      {/* <RequestServiceSelectModal
        modelId={user?.vehicle?.model?.id}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={addService}
      /> */}
      <RequestAddItemModal
        modelId={user?.vehicle?.model?.id}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onSubmit={itemAddedHandler}
      />
    </LayoutWrapper>
  );
};

export default RequestUpdate;
