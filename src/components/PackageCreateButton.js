import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import * as actions from '../store/actions';
import http from '../http';

const PackageCreateButton = ({
  children,
  sectionsData,
  servicesData,
  onFetchSections,
  onFetchServicesByTypeId,
  onCreatePackage,
}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [milestones, setMilestones] = useState({});
  const [types, setTypes] = useState([]);
  const [serviceDetails, setServiceDetails] = useState(null);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    setVisible(false);
  };

  const submitHandler = (values) => {
    onCreatePackage(values);
    closedHandler();
  };

  const fetchSelections = useCallback(() => {
    http
      .get('/service-packages/milestones')
      .then(({ data }) => {
        setMilestones(data);
        return http.get('/service-types');
      })
      .then(({ data }) => {
        setTypes(data);
      });
  }, []);

  useEffect(() => {
    if (visible) {
      fetchSelections();
      onFetchSections();
    }
  }, [visible, fetchSelections, onFetchSections]);

  return (
    <div>
      <Button icon={<PlusOutlined />} onClick={clickedHandler}>
        {children}
      </Button>
      <Modal
        visible={visible}
        title="Create Package"
        onOk={() => form.submit()}
        onCancel={closedHandler}
      >
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Form.Item name="milestoneId" label="Milestone">
            <Select
              placeholder="milestone"
              options={Object.keys(milestones).map((key) => ({
                label: milestones[key],
                value: key,
              }))}
            />
          </Form.Item>
          <Form.Item name="packageName" label="Name">
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item name="sectionId" label="Section">
            <Select
              placeholder="section"
              options={sectionsData.map(
                ({ sectionName, sectionId, ...rest }) => ({
                  label: sectionName,
                  value: sectionId,
                })
              )}
            />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="Service Type">
                <Select
                  options={types.map(({ id, name }) => ({
                    label: name,
                    value: id,
                  }))}
                  onSelect={(value) => onFetchServicesByTypeId(value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Services">
                <Select
                  onSelect={(_, option) => setServiceDetails(option.payload)}
                  options={servicesData.map(
                    ({ typeDetail, serviceDetails }) => ({
                      label: typeDetail.typeName + ' ' + typeDetail.sectionName,
                      value: typeDetail.id,
                      payload: serviceDetails,
                    })
                  )}
                />
              </Form.Item>
              <Form.Item name="serviceIds">
                <Select
                  mode="multiple"
                  options={serviceDetails?.map(({ id, name, price }) => ({
                    label: name,
                    value: id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    sectionsData: state.parts.sections,
    servicesData: state.services.services,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchSections: () => dispatch(actions.fetchPartSectionsWithCategories()),
    onFetchParts: () => dispatch(actions.fetchParts()),
    onFetchServicesByTypeId: (typeId) =>
      dispatch(actions.fetchServicesByProviderAndType(typeId)),
    onCreatePackage: (newPackage) =>
      dispatch(actions.createServicePackage(newPackage)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageCreateButton);
