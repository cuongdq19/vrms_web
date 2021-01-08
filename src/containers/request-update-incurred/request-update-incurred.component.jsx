import { Button, Col, message, Popconfirm, Row, Switch, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { WarningOutlined } from '@ant-design/icons';
import StateMachine from 'javascript-state-machine';

import http from '../../http';
import { requestStateMachineConfig, ITEM_TYPES } from '../../utils/constants';
import { calculateRequestPrice, formatMoney } from '../../utils';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import RequestAddItemModal from '../../components/request-add-item-modal/request-add-item-modal.component';
import ServicesCollectionTable from '../../components/services-collection-table/services-collection-table.component';
import PackagesCollectionTable from '../../components/packages-collection-table/packages-collection-table.component';
import RequestTotal from '../../components/request-total/request-total.component';

const RequestUpdateIncurred = () => {
  const { requestId } = useParams();

  const [item, setItem] = useState(null);
  const [visible, setVisible] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [incurred, setIncurred] = useState({ services: [], packages: [] });
  const [disables, setDisables] = useState([]);

  const { user, services = [], packages = [] } = item ?? {};

  const confirmedTotal = item
    ? calculateRequestPrice({
        services: services.filter(
          (service) => !disables.includes(service.id) && !service.isIncurred
        ),
        packages: packages.map(({ services, ...rest }) => ({
          ...rest,
          services: services.filter(
            (service) => !disables.includes(service.id) && !service.isIncurred
          ),
        })),
      })
    : 0;

  const incurredTotal = calculateRequestPrice({
    services: services.filter(
      (service) => !disables.includes(service.id) && service.isIncurred
    ),
    packages: packages.map(({ services, ...rest }) => ({
      ...rest,
      services: services.filter(
        (service) => !disables.includes(service.id) && service.isIncurred
      ),
    })),
  });

  const itemAddedHandler = (newItem, type) => {
    if (type === ITEM_TYPES.package) {
      const updatedPackages = [...incurred.packages];
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
      setIncurred((curr) => ({ ...curr, packages: updatedPackages }));
      return true;
    }
    if (type === ITEM_TYPES.expense) {
      const updatedServices = [...incurred.services];

      updatedServices.push({
        id: Math.random(),
        serviceId: null,
        serviceName: newItem.serviceName,
        servicePrice: newItem.servicePrice,
        note: newItem.note,
        parts:
          newItem.parts?.map(({ id, name, price, quantity, ...rest }) => ({
            partId: id,
            partName: name,
            quantity,
            price,
            ...rest,
          })) ?? [],
      });
      setIncurred((curr) => ({ ...curr, services: updatedServices }));
      return true;
    }
    if (type === ITEM_TYPES.existed) {
      const updatedServices = [...incurred.services];
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
      setIncurred((curr) => ({ ...curr, services: updatedServices }));
      return true;
    }
    return;
  };

  const partQuantityServicePackageIncreasedHandler = (
    packageId,
    serviceId,
    partId
  ) => {
    const updatedPackages = [...incurred.packages];
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

    setIncurred((curr) => ({ ...curr, packages: updatedPackages }));
  };

  const partQuantityServicePackageDecreasedHandler = (
    packageId,
    serviceId,
    partId
  ) => {
    const updatedPackages = [...incurred.packages];
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

    setIncurred((curr) => ({ ...curr, packages: updatedPackages }));
  };

  const confirmedServiceToggledHandler = (id, checked) => {
    const updatedRemovedServices = [...disables];
    const index = updatedRemovedServices.findIndex((service) => service === id);
    if (!checked) {
      updatedRemovedServices.push(id);
    } else {
      updatedRemovedServices.splice(index, 1);
    }

    setDisables(updatedRemovedServices);
  };

  const decreasePartQuantity = (incurredServiceId, serviceId, partId) => {
    const updatedServices = [...incurred.services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.id === incurredServiceId
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
    setIncurred((curr) => ({ ...curr, services: updatedServices }));
  };

  const increasePartQuantity = (incurredServiceId, partId) => {
    const updatedServices = [...incurred.services];
    const serviceIndex = updatedServices.findIndex(
      (service) => service.id === incurredServiceId
    );
    const updatedParts = [...updatedServices[serviceIndex].parts];
    const index = updatedParts.findIndex((part) => part.partId === partId);
    updatedParts[index].quantity++;

    updatedServices[serviceIndex].parts = updatedParts;
    setIncurred((curr) => ({ ...curr, services: updatedServices }));
  };

  const incurredServiceRemovedHandler = (incurredServiceId) => {
    const updatedIncurredServices = [...incurred.services];
    const index = updatedIncurredServices.findIndex(
      (service) => service.id === incurredServiceId
    );
    if (index < 0) {
      return;
    }
    updatedIncurredServices.splice(index, 1);
    setIncurred((curr) => ({ ...curr, services: updatedIncurredServices }));
  };

  const submitHandler = () => {
    const incurredExpenses = incurred.services
      .filter((incurred) => !incurred.serviceId)
      .map((exp) => ({
        name: exp.serviceName,
        note: exp.note,
        parts: exp.parts.reduce((accumulated, item) => {
          return { ...accumulated, [item.partId]: item.quantity };
        }, {}),
        price: exp.servicePrice,
      }));

    const incurredServices = incurred.services
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

    const incurredPackages = incurred.packages.reduce(
      (accumulatedPackages, currPackage) => {
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
      },
      {}
    );

    const enables = services
      .filter((service) => !disables.includes(service.id))
      .map((service) => service.id)
      .concat(
        packages.reduce((curr, p) => {
          const disabled = p.services
            .filter((service) => !disables.includes(service.id))
            .map((service) => service.id);
          return [...curr, ...disabled];
        }, [])
      );

    http
      .post(`/requests/update/${requestId}`, {
        expenses: incurredExpenses,
        servicePartMap: incurredServices,
        packageMap: incurredPackages,
        enables,
        disables,
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

      setDisables(
        data.services
          .filter(({ isActive }) => !isActive)
          .map(({ id }) => id)
          .concat(
            data.packages.reduce((curr, p) => {
              const disables = p.services
                .filter(({ isActive }) => !isActive)
                .map((service) => service.id);
              return [...curr, ...disables];
            }, [])
          )
      );
    });
  }, [requestId]);

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
          <ServicesCollectionTable
            dataSource={services?.map(
              ({
                serviceName,
                servicePrice,
                serviceId,
                id,
                parts,
                ...rest
              }) => ({
                requestServiceId: id,
                id: serviceId,
                name: serviceName,
                price: servicePrice,
                parts,
                ...rest,
              })
            )}
            rowKey="requestServiceId"
            columns={[
              {
                title: 'Incurred',
                dataIndex: 'isIncurred',
                align: 'center',
                render: (value = true) => (
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
                      checked={!disables.includes(record.requestServiceId)}
                      onChange={(checked) => {
                        confirmedServiceToggledHandler(
                          record.requestServiceId,
                          checked
                        );
                      }}
                    />
                  );
                },
              },
            ]}
          />
        </Col>

        <Col span={24}>
          <PackagesCollectionTable
            dataSource={packages
              .filter((p) => !p.isIncurred)
              .map(({ packageId, packageName, services, ...rest }) => ({
                id: packageId,
                name: packageName,
                services: services.map(
                  ({
                    serviceId,
                    serviceName,
                    servicePrice,
                    parts,
                    ...rest
                  }) => ({
                    id: serviceId,
                    name: serviceName,
                    price: servicePrice,
                    parts,
                    ...rest,
                  })
                ),
                ...rest,
              }))}
            rowKey="id"
            servicesExpandedColumns={[
              {
                align: 'center',
                title: 'Active',
                render: (value, record) => {
                  return (
                    <Switch
                      checked={!disables.includes(record.id)}
                      onChange={(checked) => {
                        confirmedServiceToggledHandler(record.id, checked);
                      }}
                    />
                  );
                },
              },
            ]}
          />
        </Col>

        <Col span={24}>
          <Button onClick={() => setVisible(true)}>Add Service</Button>
        </Col>

        <Col span={24}>
          <ServicesCollectionTable
            showDefaultQuantity={false}
            rowKey="incurredServiceId"
            dataSource={incurred.services.map(
              ({
                serviceId,
                serviceName,
                servicePrice,
                parts,
                id,
                ...rest
              }) => ({
                incurredServiceId: id,
                id: serviceId,
                name: serviceName,
                price: servicePrice,
                parts: parts.map((part) => ({
                  ...part,
                  incurredServiceId: id,
                })),
                ...rest,
              })
            )}
            columns={[
              {
                title: 'Remove',
                align: 'center',
                render: (_, record) => {
                  return (
                    <Popconfirm
                      icon={<WarningOutlined style={{ color: 'red' }} />}
                      title="Are you sure to remove this service? This can't be undone!"
                      onConfirm={() => {
                        incurredServiceRemovedHandler(record.incurredServiceId);
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
                    <Row align="middle" justify="space-between" gutter={[8, 8]}>
                      <Button
                        onClick={() => {
                          decreasePartQuantity(
                            record.incurredServiceId,
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
                          increasePartQuantity(
                            record.incurredServiceId,
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
        </Col>

        <Col span={24}>
          <PackagesCollectionTable
            showDefaultQuantity={false}
            dataSource={incurred.packages.map(
              ({ packageId, packageName, services, ...rest }) => ({
                id: packageId,
                name: packageName,
                services: services.map(
                  ({
                    serviceId,
                    serviceName,
                    servicePrice,
                    parts,
                    ...rest
                  }) => ({
                    packageId,
                    id: serviceId,
                    name: serviceName,
                    price: servicePrice,
                    parts: parts.map(({ id, partId, partName, ...rest }) => ({
                      packageId,
                      partId,
                      partName,
                      ...rest,
                    })),
                    ...rest,
                  })
                ),
                ...rest,
              })
            )}
            rowKey="id"
            servicesExpandedColumns={[
              {
                align: 'center',
                title: 'Remove',
                render: (value, record) => {
                  return <Button danger>Remove</Button>;
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
                    <Row align="middle" justify="space-between" gutter={[8, 8]}>
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
        </Col>

        <Col span={8} offset={16}>
          <RequestTotal
            confirmedPrice={confirmedTotal}
            incurredPrice={incurredTotal}
          />
          {/* <Summary justify="end" align="middle" gutter={[8, 8]}>
            <Col span={6}>
              <span>Confirmed: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(confirmedTotal.total)}</h3>
            </Col>
            <Col span={6}>
              <span>Incurred Services: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(incurredTotal.services)}</h3>
            </Col>
            <Col span={6}>
              <span>Incurred Packages: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(incurredTotal.packages)}</h3>
            </Col>
            <Col span={6}>
              <span>Incurred Total: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(incurredTotal.total)}</h3>
            </Col>
            <Col span={6}>
              <span>Total: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(incurredTotal.total + confirmedTotal.total)}</h3>
            </Col>
          </Summary>
         */}
        </Col>
      </Row>
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

export default RequestUpdateIncurred;
