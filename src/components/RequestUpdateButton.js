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

import * as actions from '../store/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faMinusCircle,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';

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
      onAddService(newService.current);
      newService.current = null;
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
    const index = updatedParts.findIndex((part) => part.id === record.id);
    if (index >= 0) {
      updatedParts[index].quantity++;
    } else {
      updatedParts.push({ ...record, quantity: 1 });
    }
    setExpenseInputs((curr) => ({
      ...curr,
      parts: updatedParts,
    }));
  };

  const removePartFromExpenseHandler = (partId) => {
    const updatedParts = [...expenseInputs.parts];
    const index = updatedParts.findIndex((part) => part.id === partId);
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
        name: expenseInputs.name,
        description: expenseInputs.description,
        price: expenseInputs.price,
        parts: expenseInputs.parts.map((part) => ({
          partId: part.id,
          partName: part.name,
          price: part.price,
          quantity: part.quantity,
        })),
      });
    } else {
      // Update
      onUpdateExpense({
        id: expenseInputs.id,
        name: expenseInputs.name,
        description: expenseInputs.description,
        price: expenseInputs.price,
        parts: expenseInputs.parts.map((part) => ({
          partId: part.id,
          partName: part.name,
          price: part.price,
          quantity: part.quantity,
        })),
      });
    }
    setExpenseInputs(INIT_EXPENSE);
  };

  const submitHandler = () => {
    const updatedRequest = {
      id: requestData.id,
      expenses: requestData.expenses.map((expense) => {
        const expenseParts = {};
        expense.parts.forEach((part) => {
          expenseParts[part.partId] = part.quantity;
        });
        return {
          ...expense,
          parts: expenseParts,
        };
      }),
      packageIds: [],
      serviceIds: requestData.services.map((ser) => ser.serviceId),
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
              <Row gutter={[8, 8]}>
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

                <Col span={6}>
                  <Form.Item label="Add Service">
                    <Button
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
                          Wages: {reqSer.servicePrice}
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={14}>
                    {reqSer.parts.length > 0 && (
                      <Table
                        size="small"
                        dataSource={reqSer.parts}
                        rowKey="id"
                        columns={[
                          { title: 'ID', align: 'center', dataIndex: 'id' },
                          {
                            title: 'Name',
                            align: 'center',
                            dataIndex: 'partName',
                          },
                          {
                            title: 'Quantity',
                            align: 'center',
                            dataIndex: 'quantity',
                          },
                          {
                            title: 'Price',
                            align: 'center',
                            dataIndex: 'price',
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
              <Row gutter={[8, 8]}>
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
                  <Form.Item label="Description">
                    <Input
                      size="small"
                      value={expenseInputs.description}
                      onChange={(event) =>
                        setExpenseInputs((curr) => ({
                          ...curr,
                          description: event.target.value,
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
                <Col span={6}>
                  <Form.Item label="Add">
                    <Button
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
                      { title: 'Price', dataIndex: 'price', align: 'center' },
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
                    rowKey="id"
                    size="small"
                    title={() => 'Selected Parts'}
                    dataSource={expenseInputs.parts}
                    pagination={{ pageSize: 5 }}
                    columns={[
                      { title: 'ID', dataIndex: 'id', align: 'center' },
                      { title: 'Name', dataIndex: 'name', align: 'center' },
                      { title: 'Price', dataIndex: 'price', align: 'center' },
                      {
                        title: 'Quantity',
                        dataIndex: 'quantity',
                        align: 'center',
                      },
                      {
                        title: 'Add',
                        align: 'center',
                        render: (_, record) => (
                          <Button
                            onClick={() =>
                              removePartFromExpenseHandler(record.id)
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
                          {reqExp.name}
                        </Typography.Title>
                      </Col>
                      <Col span={24}>
                        <Typography.Text>Wages: {reqExp.price}</Typography.Text>
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
                            title: 'Quantity',
                            align: 'center',
                            dataIndex: 'quantity',
                          },
                          {
                            title: 'Price',
                            align: 'center',
                            dataIndex: 'price',
                          },
                        ]}
                      />
                    )}
                  </Col>
                  <Col style={{ textAlign: 'center' }} span={2}>
                    <Button
                      icon={<FontAwesomeIcon icon={faEdit} />}
                      onClick={() =>
                        setExpenseInputs({
                          id: reqExp.id,
                          name: reqExp.name,
                          description: reqExp.description,
                          price: reqExp.price,
                          parts: reqExp.parts,
                        })
                      }
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
    requestData: state.requests,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestUpdateButton);
