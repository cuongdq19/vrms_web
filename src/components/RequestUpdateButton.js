import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tabs,
  Typography,
} from 'antd';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faMinusCircle,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import * as actions from '../store/actions';
import { formatMoney } from '../utils';

const { Option } = Select;
const { TabPane } = Tabs;

const INIT_EXPENSE = {
  id: 0,
  name: '',
  description: '',
  price: 0,
  parts: [],
};

const RequestUpdateButton = ({
  children,
  requestData,
  serviceTypesData,
  servicesData,
  partsData,
  onInitUpdate,
  onRemoveService,
  onResetUpdateRequest,
  onAddService,
  onAddExpense,
  onUpdateExpense,
  onRemoveExpense,
  onUpdatePartsInService,
  onUpdateRequest,
  onFetchServices,
}) => {
  const { services: requestServices, expenses: requestExpenses } = requestData;

  const [visible, setVisible] = useState(false);
  const [expenseInputs, setExpenseInputs] = useState(INIT_EXPENSE);
  const newService = useRef(null);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    onResetUpdateRequest();
    setVisible(false);
  };

  const addServiceHandler = () => {
    if (newService.current) {
      const index = requestServices.findIndex((ser) => {
        return ser.serviceId === newService.current.serviceId;
      });
      if (index < 0) {
        onAddService({
          ...newService.current,
          parts: newService.current.parts.map((part) => ({
            partId: part.id,
            partName: part.name,
            quantity: part.quantity,
            price: part.price,
          })),
        });
        newService.current = null;
      }
    }
  };

  const serviceSelectedHandler = (serviceDetail) => {
    const service = {
      serviceId: serviceDetail.data.id,
      serviceName: serviceDetail.data.name,
      servicePrice: serviceDetail.data.price,
      parts: serviceDetail.data.parts,
    };
    newService.current = service;
  };

  const addPartToExpenseHandler = (record) => {
    const updatedParts = [...expenseInputs.parts];
    const index = updatedParts.findIndex((part) => part.partId === record.id);
    if (index >= 0) {
      updatedParts[index].quantity++;
    } else {
      updatedParts.push({
        partId: record.id,
        partName: record.name,
        price: record.price,
        quantity: 1,
      });
    }
    setExpenseInputs((curr) => ({
      ...curr,
      parts: updatedParts,
    }));
  };

  const removePartFromExpenseHandler = (partId) => {
    const updatedParts = [...expenseInputs.parts];
    console.log(updatedParts, partId);
    const index = updatedParts.findIndex((part) => part.partId === partId);
    if (index >= 0) {
      if (updatedParts[index].quantity > 1) {
        updatedParts[index].quantity--;
      } else {
        updatedParts.splice(index, 1);
      }
    } else {
      return;
    }
    setExpenseInputs((curr) => ({
      ...curr,
      parts: updatedParts,
    }));
  };

  const addExpenseHandler = () => {
    if (expenseInputs.id === 0) {
      // Create
      onAddExpense({
        id: Math.random(),
        serviceId: null,
        serviceName: expenseInputs.name,
        servicePrice: expenseInputs.price,
        parts: expenseInputs.parts.map((part) => ({
          partId: part.partId,
          partName: part.partName,
          price: part.price,
          quantity: part.quantity,
        })),
      });
    } else {
      // Update
      onUpdateExpense({
        id: expenseInputs.id,
        serviceId: null,
        serviceName: expenseInputs.name,
        servicePrice: expenseInputs.price,
        parts: expenseInputs.parts.map((part) => ({
          partId: part.partId,
          partName: part.partName,
          price: part.price,
          quantity: part.quantity,
        })),
      });
    }
    setExpenseInputs(INIT_EXPENSE);
  };

  const decreasePartQuantityInService = (requestService, part) => {
    const updatedParts = [...requestService.parts];
    const index = updatedParts.findIndex((p) => p.partId === part.partId);
    if (index >= 0 && updatedParts[index].quantity > 0) {
      updatedParts[index].quantity--;
    } else {
      return;
    }
    onUpdatePartsInService(requestService.serviceId, updatedParts);
  };

  const increasePartQuantityInService = (requestService, part) => {
    const updatedParts = [...requestService.parts];
    const index = updatedParts.findIndex((p) => p.partId === part.partId);
    if (index >= 0) {
      updatedParts[index].quantity++;
    } else {
      return;
    }
    onUpdatePartsInService(requestService.serviceId, updatedParts);
  };

  const submitHandler = () => {
    const servicePartMap = {};
    requestData.services.forEach((ser) => {
      const { serviceId, parts } = ser;
      const partsMap = {};
      parts.forEach((part) => {
        partsMap[part.partId] = part.quantity;
      });
      servicePartMap[serviceId] = partsMap;
    });
    const updatedRequest = {
      id: requestData.id,
      packageMap: null,
      servicePartMap,
      expenses: requestData.expenses.map((expense) => {
        const expenseParts = {};
        expense.parts.forEach((part) => {
          expenseParts[part.partId] = part.quantity;
        });
        return {
          name: expense.serviceName,
          price: expense.servicePrice,
          parts: expenseParts,
        };
      }),
    };

    onUpdateRequest(updatedRequest, () => {
      message.success('Update success.');
      closedHandler();
    });
  };

  const fetchSelections = useCallback(() => {
    if (visible) {
      onInitUpdate();
    }
  }, [onInitUpdate, visible]);

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  return (
    <div>
      <Button onClick={clickedHandler}>{children}</Button>
      <Modal
        width="100%"
        centered
        maskClosable={false}
        visible={visible}
        onOk={submitHandler}
        onCancel={closedHandler}
        title="Update Request"
      >
        <Tabs centered defaultActiveKey="services">
          <TabPane tab="Services" key="services">
            <Form layout="vertical">
              <Row justify="center" align="middle" gutter={[8, 8]}>
                <Col span={6}>
                  <Form.Item label="Service Type">
                    <Select
                      size="small"
                      style={{ width: '100%' }}
                      onChange={(value) => onFetchServices(value)}
                    >
                      {serviceTypesData.map((st) => (
                        <Option key={st.id} value={st.id}>
                          {st.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Service">
                    <Cascader
                      size="small"
                      onChange={(_, [typeDetail, serviceDetail]) =>
                        serviceSelectedHandler(serviceDetail)
                      }
                      options={servicesData.map(
                        ({ typeDetail, serviceDetails }) => ({
                          label: typeDetail.sectionName,
                          value: typeDetail.id,
                          data: typeDetail,
                          children: serviceDetails.map((detail) => ({
                            label: detail.name,
                            value: detail.id,
                            data: detail,
                          })),
                        })
                      )}
                    />
                  </Form.Item>
                </Col>

                <Col span={2}>
                  <Form.Item label="Add">
                    <Button
                      size="small"
                      icon={<FontAwesomeIcon icon={faPlusCircle} />}
                      onClick={addServiceHandler}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 8]} style={{ textAlign: 'center' }}>
                <Col span={8}>
                  <Typography.Title level={4}>Services</Typography.Title>
                </Col>
                <Col span={14}>
                  <Typography.Title level={4}>Parts</Typography.Title>
                </Col>
                <Col span={2}>
                  <Typography.Title level={4}>Remove</Typography.Title>
                </Col>
              </Row>
              {requestServices?.map((reqSer) => (
                <Row key={reqSer.serviceId} gutter={[8, 8]} align="middle">
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Typography.Title level={5}>
                          {reqSer.serviceName}
                        </Typography.Title>
                      </Col>
                      <Col span={24}>
                        <Typography.Text>
                          Wages: {formatMoney(reqSer.servicePrice)}
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={14}>
                    {reqSer.parts.length > 0 && (
                      <Table
                        size="small"
                        dataSource={reqSer.parts}
                        rowKey="partId"
                        columns={[
                          { title: 'ID', align: 'center', dataIndex: 'partId' },
                          {
                            title: 'Name',
                            align: 'center',
                            dataIndex: 'partName',
                          },
                          {
                            title: 'Price',
                            align: 'center',
                            dataIndex: 'price',
                            render: (value) => formatMoney(value),
                          },
                          {
                            title: 'Quantity',
                            align: 'center',
                            dataIndex: 'quantity',
                            render: (value, record) => {
                              return (
                                <Row gutter={8} justify="center" align="middle">
                                  <Col span={10}>
                                    <Button
                                      size="small"
                                      icon={
                                        <FontAwesomeIcon icon={faMinusCircle} />
                                      }
                                      onClick={() => {
                                        decreasePartQuantityInService(
                                          reqSer,
                                          record
                                        );
                                      }}
                                    />
                                  </Col>
                                  <Col span={4}>{value}</Col>
                                  <Col span={10}>
                                    <Button
                                      size="small"
                                      icon={
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                      }
                                      onClick={() => {
                                        increasePartQuantityInService(
                                          reqSer,
                                          record
                                        );
                                      }}
                                    />
                                  </Col>
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
                    )}
                  </Col>
                  <Col style={{ textAlign: 'center' }} span={2}>
                    <Button
                      icon={<FontAwesomeIcon icon={faMinusCircle} />}
                      onClick={() => onRemoveService(reqSer.serviceId)}
                    />
                  </Col>
                </Row>
              ))}
            </Form>
          </TabPane>
          <TabPane tab="Expenses" key="expenses">
            <Form layout="vertical">
              <Row justify="center" gutter={[8, 8]}>
                <Col span={6}>
                  <Form.Item label="Name">
                    <Input
                      size="small"
                      value={expenseInputs.name}
                      onChange={(event) =>
                        setExpenseInputs((curr) => ({
                          ...curr,
                          name: event.target.value,
                        }))
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Price">
                    <InputNumber
                      value={expenseInputs.price}
                      onChange={(value) =>
                        setExpenseInputs((curr) => ({ ...curr, price: value }))
                      }
                      size="small"
                      style={{ width: '100%' }}
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item label="Add">
                    <Button
                      size="small"
                      icon={<FontAwesomeIcon icon={faPlusCircle} />}
                      onClick={addExpenseHandler}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Table
                    rowKey="id"
                    size="small"
                    title={() => 'Available Parts'}
                    dataSource={partsData}
                    pagination={{ pageSize: 5 }}
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
                        title: 'Add',
                        align: 'center',
                        render: (_, record) => (
                          <Button
                            onClick={() => addPartToExpenseHandler(record)}
                          >
                            Add
                          </Button>
                        ),
                      },
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <Table
                    rowKey="partId"
                    size="small"
                    title={() => 'Selected Parts'}
                    dataSource={expenseInputs.parts}
                    pagination={{ pageSize: 5 }}
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
                      },
                      {
                        title: 'Price',
                        align: 'center',
                        render: (_, record) =>
                          formatMoney(record.price * record.quantity),
                      },
                      {
                        title: 'Remove',
                        align: 'center',
                        render: (_, record) => (
                          <Button
                            onClick={() =>
                              removePartFromExpenseHandler(record.partId)
                            }
                          >
                            Remove
                          </Button>
                        ),
                      },
                    ]}
                  />
                </Col>
              </Row>
              <Row gutter={8} style={{ textAlign: 'center' }}>
                <Col span={8}>
                  <Typography.Title level={5}>Services</Typography.Title>
                </Col>
                <Col span={12}>
                  <Typography.Title level={5}>Parts</Typography.Title>
                </Col>
                <Col span={2}>
                  <Typography.Title level={5}>Update</Typography.Title>
                </Col>
                <Col span={2}>
                  <Typography.Title level={5}>Remove</Typography.Title>
                </Col>
              </Row>
              {requestExpenses?.map((reqExp, index) => (
                <Row key={index} gutter={8} align="middle">
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Typography.Title level={5}>
                          {reqExp.serviceName}
                        </Typography.Title>
                      </Col>
                      <Col span={24}>
                        <Typography.Text>
                          Wages: {formatMoney(reqExp.servicePrice)}
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    {reqExp.parts.length > 0 && (
                      <Table
                        size="small"
                        dataSource={reqExp.parts}
                        rowKey="partId"
                        columns={[
                          { title: 'ID', align: 'center', dataIndex: 'partId' },
                          {
                            title: 'Name',
                            align: 'center',
                            dataIndex: 'partName',
                          },
                          {
                            title: 'Price',
                            align: 'center',
                            dataIndex: 'price',
                            render: (value) => formatMoney(value),
                          },
                          {
                            title: 'Quantity',
                            align: 'center',
                            dataIndex: 'quantity',
                          },
                          {
                            title: 'Total Price',
                            align: 'center',
                            render: (_, record) =>
                              formatMoney(record.price * record.quantity),
                          },
                        ]}
                      />
                    )}
                  </Col>
                  <Col style={{ textAlign: 'center' }} span={2}>
                    <Button
                      icon={<FontAwesomeIcon icon={faEdit} />}
                      onClick={() => {
                        const expense = _.cloneDeep(reqExp);
                        setExpenseInputs({
                          id: expense.id,
                          name: expense.serviceName,
                          price: expense.servicePrice,
                          parts: expense.parts,
                        });
                      }}
                    />
                  </Col>
                  <Col style={{ textAlign: 'center' }} span={2}>
                    <Button
                      icon={<FontAwesomeIcon icon={faMinusCircle} />}
                      onClick={() => onRemoveExpense(reqExp.id)}
                    />
                  </Col>
                </Row>
              ))}
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    requestData: {
      id: state.requests.id,
      services: state.requests.services,
      expenses: state.requests.expenses,
    },
    serviceTypesData: state.services.types,
    servicesData: state.services.services,
    partsData: state.parts.parts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onResetUpdateRequest: () => dispatch(actions.resetUpdateRequest()),
    onFetchServices: (typeId) =>
      dispatch(actions.fetchServicesByProviderAndType(typeId)),
    onAddService: (newService) =>
      dispatch(actions.addServiceToRequest(newService)),
    onRemoveService: (serviceId) =>
      dispatch(actions.removeServiceFromRequest(serviceId)),
    onRemoveExpense: (expenseId) =>
      dispatch(actions.removeExpenseFromRequest(expenseId)),
    onAddExpense: (newExpense) =>
      dispatch(actions.addExpenseToRequest(newExpense)),
    onUpdateExpense: (updatedExpense) =>
      dispatch(actions.updatedExpenseToRequest(updatedExpense)),
    onUpdateRequest: (updatedRequest, callback) =>
      dispatch(actions.updateRequest(updatedRequest, callback)),
    onUpdatePartsInService: (serviceId, updatedParts) =>
      dispatch(actions.updatePartsInRequestService(serviceId, updatedParts)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestUpdateButton);
