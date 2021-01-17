import React, { useEffect, useState } from 'react';
import { Button, Col, message, Popconfirm, Row, Table } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';

import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';
import { Content, Title } from './request-update-page.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import RequestUpdateAddServiceModal from '../../components/request-update-add-service-modal/request-update-add-service-modal.component';
import http from '../../http';
import {
  calculatePackagePrice,
  calculateServicePrice,
  formatMoney,
} from '../../utils';
import { ServiceItemTypes } from '../../utils/constants';
import { updateRequestStart } from '../../redux/request/request.actions';

const ServiceTable = ({ title, data, onRemove, onQuantityChanged }) => (
  <Table
    title={title}
    dataSource={data}
    rowKey="id"
    columns={[
      {
        title: 'ID',
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      { title: 'Name', dataIndex: 'name', align: 'center' },
      {
        title: 'Wages',
        dataIndex: 'price',
        align: 'center',
        render: (value) => formatMoney(value),
      },
      {
        title: 'Total Price',
        align: 'center',
        render: (_, record) => {
          const total = calculateServicePrice(record);
          return formatMoney(total);
        },
      },
      {
        title: 'Remove',
        align: 'center',
        render: (_, record) => {
          return (
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => onRemove(record.id)}
            >
              <Button danger>Remove</Button>
            </Popconfirm>
          );
        },
      },
    ]}
    expandable={{
      rowExpandable: (record) => record.parts?.length > 0,
      expandedRowRender: (record) => {
        const { id: serviceId } = record;
        return (
          <Table
            rowKey="id"
            dataSource={record.parts}
            columns={[
              { title: 'ID', dataIndex: 'id', align: 'center' },
              { title: 'Name', dataIndex: 'name', align: 'center' },
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
                render: (value, record) => (
                  <Row align="middle" justify="space-between" gutter={[16, 16]}>
                    <Col>
                      <Button
                        onClick={() =>
                          onQuantityChanged(
                            serviceId,
                            record.id,
                            value > 1 ? value - 1 : 0
                          )
                        }
                      >
                        -
                      </Button>
                    </Col>
                    <Col>
                      <span>{value}</span>
                    </Col>
                    <Col>
                      <Button
                        onClick={() =>
                          onQuantityChanged(serviceId, record.id, value + 1)
                        }
                      >
                        +
                      </Button>
                    </Col>
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
        );
      },
    }}
  />
);

const PackageTable = ({ title, data, onRemove, onQuantityChanged }) => (
  <Table
    title={title}
    dataSource={data}
    rowKey="id"
    columns={[
      { title: 'ID', dataIndex: 'id', align: 'center' },
      { title: 'Name', dataIndex: 'name', align: 'center' },
      {
        title: 'Milestone / Section',
        align: 'center',
        render: (_, record) => record.sectionName || record.milestone + ` KM`,
      },
      {
        title: 'Total Price',
        align: 'center',
        render: (_, record) => {
          const total = calculatePackagePrice(record);
          return formatMoney(total);
        },
      },
    ]}
    expandable={{
      rowExpandable: (record) => record.services.length > 0,
      expandedRowRender: (record) => {
        const { id: packageId } = record;
        return (
          <Table
            rowKey="id"
            dataSource={record.services}
            columns={[
              {
                title: 'ID',
                dataIndex: 'id',
                align: 'center',
              },
              { title: 'Name', dataIndex: 'name', align: 'center' },
              {
                title: 'Wages',
                dataIndex: 'price',
                align: 'center',
                render: (value) => formatMoney(value),
              },
              {
                title: 'Total Price',
                align: 'center',
                render: (_, record) => {
                  const total = calculateServicePrice(record);
                  return formatMoney(total);
                },
              },
              {
                title: 'Remove',
                align: 'center',
                render: (_, record) => {
                  return (
                    <Popconfirm
                      title="Are you sure?"
                      onConfirm={() => onRemove(packageId, record.id)}
                    >
                      <Button danger>Remove</Button>
                    </Popconfirm>
                  );
                },
              },
            ]}
            expandable={{
              rowExpandable: (record) => record.parts.length > 0,
              expandedRowRender: (record) => {
                const { id: serviceId } = record;
                return (
                  <Table
                    rowKey="id"
                    dataSource={record.parts}
                    columns={[
                      { title: 'ID', dataIndex: 'id', align: 'center' },
                      { title: 'Name', dataIndex: 'name', align: 'center' },
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
                        render: (value, record) => (
                          <Row
                            align="middle"
                            justify="space-between"
                            gutter={[16, 16]}
                          >
                            <Col>
                              <Button
                                onClick={() =>
                                  onQuantityChanged(
                                    packageId,
                                    serviceId,
                                    record.id,
                                    value > 1 ? value - 1 : 0
                                  )
                                }
                              >
                                -
                              </Button>
                            </Col>
                            <Col>
                              <span>{value}</span>
                            </Col>
                            <Col>
                              <Button
                                onClick={() =>
                                  onQuantityChanged(
                                    packageId,
                                    serviceId,
                                    record.id,
                                    value + 1
                                  )
                                }
                              >
                                +
                              </Button>
                            </Col>
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
                );
              },
            }}
          />
        );
      },
    }}
  />
);

const RequestUpdatePage = ({ history, match, isUpdating, onUpdateRequest }) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [visible, setVisible] = useState(false);

  const itemAddedHandler = (itemType, newItem) => {
    if (!newItem) {
      message.info("Service can't be blank.");
      return;
    }
    switch (itemType) {
      case ServiceItemTypes.SERVICES:
        return serviceAddedHandler(newItem);
      case ServiceItemTypes.PACKAGES:
        return packageAddedHandler(newItem);
      case ServiceItemTypes.EXPENSES:
        return expenseAddedHandler(newItem);
      default:
        return;
    }
  };

  const expenseAddedHandler = (newItem) => {
    const updatedServices = [...currentItem.services];
    updatedServices.push({ id: uuidv4(), isExpense: true, ...newItem });
    setVisible(false);
    setCurrentItem((curr) => ({
      ...curr,
      services: updatedServices,
    }));
    message.success('Added successfully.');
    return true;
  };

  const packageAddedHandler = (newItem) => {
    const updatedPackages = [...currentItem.packages];
    const index = updatedPackages.findIndex((p) => p.id === newItem.id);
    if (index >= 0) {
      message.info('Package has already been added.');
      return;
    }
    updatedPackages.push(newItem);
    setVisible(false);
    setCurrentItem((curr) => ({ ...curr, packages: updatedPackages }));
    message.success('Added successfully.');
    return true;
  };

  const serviceAddedHandler = (newItem) => {
    const updatedServices = [...currentItem.services];
    const index = updatedServices.findIndex(
      (service) => service.id === newItem.id
    );
    if (index >= 0) {
      message.info('Service has already been added.');
      return;
    }
    updatedServices.push(newItem);
    setVisible(false);
    setCurrentItem((curr) => ({
      ...curr,
      services: updatedServices,
    }));
    message.success('Added successfully.');
    return true;
  };

  const serviceRemovedHandler = (serviceId) => {
    const updatedServices = [...currentItem.services];
    const index = updatedServices.findIndex(
      (service) => service.id === serviceId
    );
    if (index < 0) {
      return;
    }
    updatedServices.splice(index, 1);
    setCurrentItem((curr) => ({ ...curr, services: updatedServices }));
    message.success('Remove successfully.');
  };

  const serviceRemovedInPackageHandler = (packageId, serviceId) => {
    const updatedPackages = [...currentItem.packages];
    const packageIndex = updatedPackages.findIndex((p) => p.id === packageId);
    if (packageIndex < 0) {
      return;
    }
    const updatedServices = [...updatedPackages[packageIndex].services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.id === serviceId
    );
    if (serviceIndex < 0) {
      return;
    }
    updatedServices.splice(serviceIndex, 1);
    if (updatedServices.length === 0) {
      updatedPackages.splice(packageIndex, 1);
    } else {
      updatedPackages[packageIndex].services = updatedServices;
    }
    setCurrentItem((curr) => ({ ...curr, packages: updatedPackages }));
    message.success('Remove successfully.');
  };

  const servicePartQuantityChangedHandler = (
    serviceId,
    partId,
    newQuantity
  ) => {
    const updatedServices = [...currentItem.services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.id === serviceId
    );
    if (serviceIndex < 0) {
      return;
    }
    const updatedParts = updatedServices[serviceIndex].parts;
    const partIndex = updatedParts.findIndex((part) => part.id === partId);
    if (partIndex < 0) {
      return;
    }
    updatedParts[partIndex].quantity = newQuantity;
    updatedServices[serviceIndex].parts = updatedParts;
    setCurrentItem((curr) => ({ ...curr, services: updatedServices }));
  };

  const servicePartQuantityInPackageChangedHandler = (
    packageId,
    serviceId,
    partId,
    newQuantity
  ) => {
    const updatedPackages = [...currentItem.packages];
    const packageIndex = updatedPackages.findIndex((p) => p.id === packageId);
    if (packageIndex < 0) {
      return;
    }
    const updatedServices = [...updatedPackages[packageIndex].services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.id === serviceId
    );
    if (serviceIndex < 0) {
      return;
    }
    const updatedParts = updatedServices[serviceIndex].parts;
    const partIndex = updatedParts.findIndex((part) => part.id === partId);
    if (partIndex < 0) {
      return;
    }
    updatedParts[partIndex].quantity = newQuantity;
    updatedServices[serviceIndex].parts = updatedParts;
    updatedPackages[packageIndex].services = updatedServices;
    setCurrentItem((curr) => ({ ...curr, packages: updatedPackages }));
  };

  const submitHandler = () => {
    onUpdateRequest({ item: currentItem, history });
  };

  useEffect(() => {
    http.get(`/requests/${match.params.requestId}`).then(({ data }) => {
      const { services, packages, parts, ...rest } = data;
      const transformedData = {
        ...rest,
        packages: packages.map(
          ({ packageId, packageName, services, ...rest }) => ({
            id: packageId,
            name: packageName,
            services: services.map(
              ({
                id,
                serviceId,
                serviceName,
                servicePrice,
                parts,
                ...rest
              }) => ({
                ...rest,
                itemId: id,
                id: serviceId,
                name: serviceName,
                price: servicePrice,
                parts: parts.map(({ id, partId, partName, ...rest }) => ({
                  ...rest,
                  id: partId,
                  name: partName,
                })),
              })
            ),
            ...rest,
          })
        ),

        services: services.map(
          ({ id, serviceId, serviceName, servicePrice, parts, ...rest }) => ({
            ...rest,
            itemId: id,
            isExpense: serviceId === null,
            id: serviceId || id,
            name: serviceName,
            price: servicePrice,
            parts: parts.map(({ id, partId, partName, ...rest }) => ({
              ...rest,
              id: partId,
              name: partName,
            })),
          })
        ),
      };
      setCurrentItem(transformedData);
    });
  }, [match.params.requestId]);

  return (
    <LayoutWrapper>
      {isUpdating ? (
        <LoadingSpinner title="Saving your changes ..." />
      ) : (
        <>
          <Title>
            <h1>Update Request</h1>
            <Button type="primary" onClick={submitHandler}>
              Save
            </Button>
          </Title>
          <Content>
            <Button onClick={() => setVisible(true)}>Add Service</Button>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <ServiceTable
                  title={() => <h1>Services</h1>}
                  data={currentItem?.services.filter(
                    ({ isExpense }) => !isExpense
                  )}
                  onRemove={serviceRemovedHandler}
                  onQuantityChanged={servicePartQuantityChangedHandler}
                />
              </Col>
              <Col span={12}>
                <ServiceTable
                  title={() => <h1>Custom Expenses</h1>}
                  data={currentItem?.services.filter(
                    ({ isExpense }) => isExpense
                  )}
                  onRemove={serviceRemovedHandler}
                  onQuantityChanged={servicePartQuantityChangedHandler}
                />
              </Col>
            </Row>
            <PackageTable
              title={() => <h1>Packages</h1>}
              data={currentItem?.packages}
              onRemove={serviceRemovedInPackageHandler}
              onQuantityChanged={servicePartQuantityInPackageChangedHandler}
            />
            <RequestUpdateAddServiceModal
              visible={visible}
              modelId={currentItem?.user.vehicle.model.id}
              onCancel={() => setVisible(false)}
              onSubmit={itemAddedHandler}
            />
          </Content>
        </>
      )}
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  isUpdating: state.requests.isUpdating,
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateRequest: ({ item, history }) =>
    dispatch(updateRequestStart({ item, history })),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestUpdatePage);
