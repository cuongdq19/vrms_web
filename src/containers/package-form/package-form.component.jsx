import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ServicesCollectionTable from '../../components/services-collection-table/services-collection-table.component';

import { Title, Content } from './package-form.styles';
import http from '../../http';

const packageTypes = { milestone: 0, section: 1 };

const filterServicesByModelIds = (serviceArr, modelIds) => {
  const filteredServices =
    serviceArr?.filter(
      ({ models }) =>
        modelIds?.every((el) => models.map((m) => m.id).includes(el)) ?? true
    ) ?? [];
  return filteredServices;
};

const PackageForm = ({ history, providerId }) => {
  const { packageId } = useParams();
  const {
    location: { state },
  } = history;
  const { models: packageModels } = state ?? {};
  const [form] = Form.useForm();

  const [packageType, setPackageType] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [sections, setSections] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [redirect, setRedirect] = useState(false);

  const toggleSelect = (serviceId) => {
    const updatedSelected = [...selectedServiceIds];
    const index = updatedSelected.findIndex((id) => id === serviceId);
    if (index >= 0) {
      updatedSelected.splice(index, 1);
    } else {
      updatedSelected.push(serviceId);
    }
    setSelectedServiceIds(updatedSelected);
  };

  const submitHandler = ({ milestoneId, sectionId, packageName, id }) => {
    console.log(id);
    if (!id) {
      http
        .post(`/maintenance-packages/providers/${providerId}`, {
          milestoneId: milestoneId ?? null,
          packageName: packageName,
          sectionId: sectionId ?? null,
          serviceIds: selectedServiceIds,
        })
        .then(({ data }) => {
          message.success('Successfully create package');
          setRedirect(true);
        });
    } else {
      http
        .post(`/maintenance-packages/${id}`, {
          milestoneId: milestoneId ?? null,
          packageName: packageName,
          sectionId: sectionId ?? null,
          serviceIds: selectedServiceIds,
        })
        .then(({ data }) => {
          message.success('Successfully update package');
          setRedirect(true);
        });
    }
  };

  const loadServices = useCallback(() => {
    return http
      .get(`/maintenance-packages/providers/${providerId}/services`)
      .then(({ data }) =>
        setServices(filterServicesByModelIds(data, packageModels))
      );
  }, [packageModels, providerId]);

  const loadDetail = useCallback(() => {
    if (packageId) {
      return http.get(`/maintenance-packages/${packageId}`);
    }
    return Promise.resolve();
  }, [packageId]);

  const loadData = useCallback(() => {
    if (packageType === packageTypes.milestone) {
      return http
        .get('/maintenance-packages/milestones')
        .then(({ data }) => setMilestones(data));
    }
    if (packageType === packageTypes.section) {
      return http
        .get('/service-type-details/sections/plain')
        .then(({ data }) => setSections(data));
    }
    return Promise.resolve();
  }, [packageType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    loadDetail().then((res) => {
      if (res) {
        const { id, name, milestone, sectionId, packagedServices } = res.data;
        form.setFieldsValue({
          id: id,
          packageName: name,
          milestoneId: milestone,
          sectionId,
        });

        setSelectedServiceIds(packagedServices.map((service) => service.id));
        setPackageType(
          milestone ? packageTypes.milestone : packageTypes.section
        );
      }
    });
  }, [form, loadDetail]);

  if (redirect) {
    return <Redirect to="/packages" />;
  }

  return (
    <LayoutWrapper>
      <Title>
        <h1>Create Maintenance Package</h1>
        <Button type="primary" onClick={() => form.submit()}>
          Submit
        </Button>
      </Title>
      <Content>
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Row gutter={[8, 8]}>
            <Form.Item hidden name="id">
              <Input />
            </Form.Item>
            <Col span={24}>
              <Form.Item label="Package Type">
                <Radio.Group
                  value={packageType}
                  onChange={(event) => {
                    setPackageType(event.target.value);
                  }}
                >
                  <Radio value={0}>By Milestone</Radio>
                  <Radio value={1}>By Section</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="packageName" label="Package Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Milestone"
                name="milestoneId"
                hidden={packageType !== packageTypes.milestone}
              >
                <Select
                  options={milestones.map((m) => ({
                    label: m.milestone,
                    value: m.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Section"
                name="sectionId"
                hidden={packageType !== packageTypes.section}
              >
                <Select
                  options={sections.map((m) => ({
                    label: m.sectionName,
                    value: m.sectionId,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Services">
                <ServicesCollectionTable
                  dataSource={services.map(({ parts, ...rest }) => ({
                    ...rest,
                    parts: parts.map(
                      ({ id, name, price, quantity, ...rest }) => ({
                        partId: id,
                        partName: name,
                        price,
                        quantity,
                        ...rest,
                      })
                    ),
                  }))}
                  rowKey="id"
                  columns={[
                    {
                      align: 'center',
                      title: 'Add To List',
                      render: (_, record) => (
                        <Checkbox
                          checked={selectedServiceIds.includes(record.id)}
                          onChange={() => toggleSelect(record.id)}
                        />
                      ),
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Content>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    providerId: state.auth?.userData?.providerId,
  };
};

export default connect(mapStateToProps)(PackageForm);
