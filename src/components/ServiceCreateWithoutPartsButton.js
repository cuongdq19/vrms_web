import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';

import http from '../http';
import * as actions from '../store/actions';

const { Option } = Select;

const ServiceCreateWithoutPartsButton = ({
  children,
  onSuccess,
  manufacturersData,
  modelsData,
  serviceTypesData,
  sectionsData,
  onInitModifyService,
  onFetchSections,
  loading,
}) => {
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const clickedHandler = () => {
    setVisible(true);
  };

  const closedHandler = () => {
    form.resetFields();
    setVisible(false);
  };

  const serviceTypeChangedHandler = (typeId) => {
    onFetchSections(typeId);
  };

  const submitHandler = (values) => {
    const { typeDetailId, modelIds, name, price } = values;
    let url = `/services/providers/${providerId}/non-replacing`;
    let reqBody = {
      typeDetailId,
      serviceName: name,
      price: price,
      modelIds,
    };

    http
      .post(url, reqBody)
      .then(({ data }) => {
        message.success('Create service success.');
        closedHandler();
        onSuccess();
      })
      .catch((err) => console.log(err));
  };

  const fetchSelections = useCallback(() => {
    if (visible) {
      onInitModifyService();
    }
  }, [visible, onInitModifyService]);

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  return (
    <>
      <Button type="link" onClick={clickedHandler}>
        {children}
      </Button>
      <Modal
        width="100%"
        centered
        maskClosable={false}
        onOk={() => form.submit()}
        visible={visible}
        onCancel={closedHandler}
        title="Create Service"
      >
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="typeId"
                label="Service Type"
                rules={[
                  { required: true, message: "Service Type can't be blank!" },
                ]}
              >
                <Select onChange={serviceTypeChangedHandler} loading={loading}>
                  {serviceTypesData.map((st) => (
                    <Option key={st.id} value={st.id}>
                      {st.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="typeDetailId"
                label="Section Name"
                rules={[
                  { required: true, message: "Section Name can't be blank!" },
                ]}
              >
                <Select loading={loading}>
                  {sectionsData.map((std) => (
                    <Option key={std.id} value={std.id}>
                      {std.sectionName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="name"
            label="Service Name"
            rules={[
              { required: true, message: "Service Name can't be blank!" },
            ]}
          >
            <Input placeholder="Enter service name" />
          </Form.Item>
          <Row gutter={8}>
            <Col span={20}>
              <Form.Item
                label="Models"
                name="modelIds"
                rules={[{ required: true, message: "Models can't be blank!" }]}
              >
                <Select
                  showSearch
                  mode="multiple"
                  loading={loading}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    return (
                      option.children
                        .join('')
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {modelsData.map((model) => (
                    <Option key={model.id} value={model.id}>
                      {model.manufacturerName} {model.name} {model.fuelType}{' '}
                      {model.gearbox} ({model.year})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Price can't be blank!" }]}
              >
                <InputNumber style={{ width: '100%' }} type="number" min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    manufacturersData: state.vehicles.manufacturers,
    modelsData: state.vehicles.models,
    serviceTypesData: state.services.types,
    sectionsData: state.services.sections,
    loading: state.services.loading || state.vehicles.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitModifyService: () => dispatch(actions.initModifyService()),
    onFetchSections: (typeId) => dispatch(actions.fetchServiceSections(typeId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceCreateWithoutPartsButton);
