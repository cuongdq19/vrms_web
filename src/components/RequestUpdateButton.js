import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
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
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const { Option } = Select;
const { TabPane } = Tabs;

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
  onRemoveExpense,
  onFetchServices,
}) => {
  const { services: requestServices, expenses: requestExpenses } = requestData;
  const [visible, setVisible] = useState(false);
  const selected = useRef(null);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    onResetUpdateRequest();
    setVisible(false);
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
                      onChange={(_, [typeDetail, serviceDetail]) => {
                        console.log(serviceDetail.data);
                        const newService = {
                          serviceId: serviceDetail.data.id,
                          serviceName: serviceDetail.data.name,
                          servicePrice: serviceDetail.data.price,
                          parts: serviceDetail.data.parts,
                        };
                        selected.current = newService;
                      }}
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
                      onClick={() => {
                        if (selected.current) {
                          onAddService(selected.current);
                          selected.current = null;
                        }
                      }}
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
                    <Input size="small" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Description">
                    <Input size="small" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Price">
                    <InputNumber
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
                      onClick={() => {}}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Table
                    rowKey="id"
                    size="small"
                    dataSource={partsData}
                    pagination={{ pageSize: 5 }}
                    columns={[
                      { title: 'ID', dataIndex: 'id', align: 'center' },
                      { title: 'Name', dataIndex: 'name', align: 'center' },
                      { title: 'Price', dataIndex: 'price', align: 'center' },
                      {
                        title: 'Add',
                        align: 'center',
                        render: (_, record) => <Button>Add</Button>,
                      },
                    ]}
                  />
                </Col>
              </Row>
              <Row gutter={8} style={{ textAlign: 'center' }}>
                <Col span={8}>
                  <Typography.Title level={5}>Services</Typography.Title>
                </Col>
                <Col span={14}>
                  <Typography.Title level={5}>Parts</Typography.Title>
                </Col>
                <Col span={2}>
                  <Typography.Title level={5}>Remove</Typography.Title>
                </Col>
              </Row>
              {requestExpenses?.map((reqExp) => (
                <Row key={reqExp.id} gutter={8} align="middle">
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
                  <Col span={14}>
                    {reqExp.parts.length > 0 && (
                      <Table
                        size="small"
                        dataSource={reqExp.parts}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestUpdateButton);
