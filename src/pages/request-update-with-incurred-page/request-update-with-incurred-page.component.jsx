import React, { useEffect, useState } from 'react';
import { Button, Col, message, Popconfirm, Row, Switch, Table } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';

import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';
import { Content, Title } from './request-update-with-incurred-page.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import RequestUpdateAddServiceModal from '../../components/request-update-add-service-modal/request-update-add-service-modal.component';
import http from '../../http';
import {
  calculatePackagePrice,
  calculateServicePrice,
  formatMoney,
} from '../../utils';
import { ServiceItemTypes } from '../../utils/constants';
import { updateRequestWithIncurredStart } from '../../redux/request/request.actions';

const ServiceTable = ({
  title,
  data,
  confirmed,
  onToggleStatus,
  onRemove,
  onQuantityChanged,
}) => (
  <Table
    title={title}
    dataSource={data}
    rowKey="itemId"
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
        title: 'Active',
        align: 'center',
        render: (_, record) => {
          if (confirmed) {
            return (
              <Switch
                checked={record.isActive}
                onChange={() => {
                  onToggleStatus(record.itemId);
                }}
              />
            );
          }
          return (
            <Button danger onClick={() => onRemove(record.id)}>
              Remove
            </Button>
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
                render: (value, record) =>
                  confirmed ? (
                    value
                  ) : (
                    <Row
                      align="middle"
                      justify="space-between"
                      gutter={[16, 16]}
                    >
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

const PackageTable = ({
  title,
  data,
  confirmed,
  onToggleStatus,
  onRemove,
  onQuantityChanged,
}) => (
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
                  if (confirmed) {
                    return (
                      <Switch
                        checked={record.isActive}
                        onChange={() => {
                          onToggleStatus(packageId, record.id);
                        }}
                      />
                    );
                  }
                  return (
                    <Popconfirm
                      title="Are you sure?"
                      onConfirm={() => {
                        onRemove(packageId, record.id);
                      }}
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
                        render: (value, record) =>
                          confirmed ? (
                            value
                          ) : (
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

const RequestUpdateWithIncurredPage = ({
  history,
  match,
  isUpdating,
  onUpdateRequest,
}) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [incurred, setIncurred] = useState({
    services: [],
    packages: [],
  });
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
    const updatedServices = [...incurred.services];
    updatedServices.push({
      itemId: uuidv4(),
      isExpense: true,
      ...newItem,
    });
    setVisible(false);
    setIncurred((curr) => ({
      ...curr,
      services: updatedServices,
    }));
    message.success('Added successfully.');
    return true;
  };

  const packageAddedHandler = (newItem) => {
    const updatedPackages = [...incurred.packages];
    const index =
      updatedPackages.findIndex((p) => p.id === newItem.id) >= 0 ||
      currentItem.packages.findIndex((p) => p.id === newItem.id) >= 0;
    if (index) {
      message.info('Package has already been added.');
      return;
    }
    updatedPackages.push(newItem);
    setVisible(false);
    setIncurred((curr) => ({ ...curr, packages: updatedPackages }));
    message.success('Added successfully.');
    return true;
  };

  const serviceAddedHandler = (newItem) => {
    const updatedServices = [...incurred.services];
    const index = updatedServices.findIndex(
      (service) => service.id === newItem.id
    );
    if (index >= 0) {
      message.info('Service has already been added.');
      return;
    }
    updatedServices.push({ itemId: uuidv4(), ...newItem });
    setVisible(false);
    setIncurred((curr) => ({
      ...curr,
      services: updatedServices,
    }));
    message.success('Added successfully.');
    return true;
  };

  const serviceToggledHandler = (itemId) => {
    const updatedServices = [...currentItem.services];
    const index = updatedServices.findIndex(
      (service) => service.itemId === itemId
    );
    if (index < 0) {
      return;
    }
    updatedServices[index].isActive = !updatedServices[index].isActive;
    setCurrentItem((curr) => ({ ...curr, services: updatedServices }));
  };

  const serviceToggledInPackageHandler = (packageId, serviceId) => {
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
    updatedServices[serviceIndex].isActive = !updatedServices[serviceIndex]
      .isActive;
    updatedPackages[packageIndex].services = updatedServices;
    setCurrentItem((curr) => ({ ...curr, packages: updatedPackages }));
  };

  const serviceRemovedHandler = (serviceId) => {
    const updatedServices = [...incurred.services];
    const index = updatedServices.findIndex(
      (service) => service.id === serviceId
    );
    if (index < 0) {
      return;
    }
    updatedServices.splice(index, 1);
    setIncurred((curr) => ({ ...curr, services: updatedServices }));
    message.success('Remove successfully.');
  };

  const serviceRemovedInPackageHandler = (packageId, serviceId) => {
    const updatedPackages = [...incurred.packages];
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
    setIncurred((curr) => ({ ...curr, packages: updatedPackages }));
    message.success('Remove successfully.');
  };

  const servicePartQuantityChangedHandler = (
    serviceId,
    partId,
    newQuantity
  ) => {
    const updatedServices = [...incurred.services];
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
    setIncurred((curr) => ({ ...curr, services: updatedServices }));
  };

  const servicePartQuantityInPackageChangedHandler = (
    packageId,
    serviceId,
    partId,
    newQuantity
  ) => {
    const updatedPackages = [...incurred.packages];
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
    setIncurred((curr) => ({ ...curr, packages: updatedPackages }));
  };

  const submitHandler = () => {
    onUpdateRequest({ confirmedItem: currentItem, incurred, history });
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
            isExpense: serviceId === null,
            itemId: id,
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
            <Title>
              <h1>Confirmed Services</h1>
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <ServiceTable
                  confirmed
                  title={() => <h1>Services</h1>}
                  data={currentItem?.services.filter(
                    ({ isExpense }) => !isExpense
                  )}
                  onToggleStatus={serviceToggledHandler}
                  onQuantityChanged={servicePartQuantityChangedHandler}
                />
              </Col>
              <Col span={12}>
                <ServiceTable
                  confirmed
                  title={() => <h1>Custom Expenses</h1>}
                  data={currentItem?.services.filter(
                    ({ isExpense }) => isExpense
                  )}
                  onToggleStatus={serviceToggledHandler}
                  onQuantityChanged={servicePartQuantityChangedHandler}
                />
              </Col>
            </Row>
            <PackageTable
              confirmed
              title={() => <h1>Packages</h1>}
              data={currentItem?.packages}
              onToggleStatus={serviceToggledInPackageHandler}
              onQuantityChanged={servicePartQuantityInPackageChangedHandler}
            />
            <Title>
              <h1>Incurred Services</h1>
              <Button onClick={() => setVisible(true)}>Add Service</Button>
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <ServiceTable
                  title={() => <h1>Services</h1>}
                  onRemove={serviceRemovedHandler}
                  data={incurred.services.filter(({ isExpense }) => !isExpense)}
                  onQuantityChanged={servicePartQuantityChangedHandler}
                />
              </Col>
              <Col span={12}>
                <ServiceTable
                  title={() => <h1>Custom Expenses</h1>}
                  data={incurred.services.filter(({ isExpense }) => isExpense)}
                  onRemove={serviceRemovedHandler}
                  onQuantityChanged={servicePartQuantityChangedHandler}
                />
              </Col>
            </Row>
            <PackageTable
              title={() => <h1>Packages</h1>}
              data={incurred.packages}
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
  onUpdateRequest: ({ confirmedItem, incurred, history }) =>
    dispatch(
      updateRequestWithIncurredStart({ confirmedItem, incurred, history })
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestUpdateWithIncurredPage);
