import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Select, Table, Typography } from 'antd';
import { connect } from 'react-redux';

import * as actions from '../store/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

const { Option } = Select;

const RequestUpdateButton = ({
  onInitUpdate,
  children,
  requestData,
  serviceTypesData,
  sectionsData = [],
  onResetUpdateRequest,
  onFetchSections,
}) => {
  const { services: requestServices } = requestData;
  const [visible, setVisible] = useState(false);

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
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              onChange={(value) => onFetchSections(value)}
            >
              {serviceTypesData.map((st) => (
                <Option key={st.id} value={st.id}>
                  {st.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select style={{ width: '100%' }}>
              {sectionsData.map((sect) => (
                <Option key={sect.id} value={sect.id}>
                  {sect.sectionName}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={[8, 8]} style={{ textAlign: 'center' }}>
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
        {requestServices?.map((reqSer) => (
          <Row key={reqSer.id} gutter={[8, 8]} align="middle">
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
                    { title: 'Name', align: 'center', dataIndex: 'partName' },
                    {
                      title: 'Quantity',
                      align: 'center',
                      dataIndex: 'quantity',
                    },
                    { title: 'Price', align: 'center', dataIndex: 'price' },
                  ]}
                />
              )}
            </Col>
            <Col style={{ textAlign: 'center' }} span={2}>
              <Button icon={<FontAwesomeIcon icon={faMinusCircle} />} />
            </Col>
          </Row>
        ))}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    requestData: state.requests,
    serviceTypesData: state.services.types,
    sectionsData: state.services.sections,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onResetUpdateRequest: () => dispatch(actions.resetUpdateRequest()),
    onFetchSections: (typeId) => dispatch(actions.fetchServiceSections(typeId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestUpdateButton);
