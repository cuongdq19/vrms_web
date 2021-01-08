import { Button, Checkbox, Col, Form, Input, Radio, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { Content, Title } from './package-form.styles';
import ServicesCollectionTable from '../services-collection-table/services-collection-table.component';

import http from '../../http';
import { connect } from 'react-redux';

const INIT_PACKAGE = {
  id: 0,
  milestoneId: null,
  packageName: '',
  sectionId: null,
  milestoneValue: null,
  sectionName: null,
  services: [],
};

const milestoneTypes = { milestone: 0, section: 1 };

const PackageForm = ({ item: packageItem, onSubmit, modelIds, providerId }) => {
  const [form] = Form.useForm();
  const [milestoneType, setMilestoneType] = useState(0);

  const [item, setItem] = useState(INIT_PACKAGE);
  const [milestones, setMilestones] = useState([]);
  const [sections, setSections] = useState([]);
  const [services, setServices] = useState([]);

  const submitHandler = (values) => {
    const reqBody = {
      id: item.id,
      milestoneId: item.milestoneId,
      packageName: item.packageName,
      sectionId: item.sectionId,
      serviceIds: item.services.map((service) => service.id),
    };
    onSubmit(reqBody);
  };

  useEffect(() => {
    if (packageItem) {
      const {
        id,
        name,
        sectionId,
        milestone: milestoneValue,
        sectionName,
        packagedServices: services,
      } = packageItem;
      if (milestoneValue) {
        setMilestoneType(milestoneTypes.milestone);
      } else {
        setMilestoneType(milestoneTypes.section);
      }
      setItem({
        id,
        packageName: name,
        sectionId,
        milestoneValue,
        sectionName,
        services,
      });
    }
  }, [packageItem]);

  useEffect(() => {
    http
      .get(`/maintenance-packages/providers/${providerId}/services`)
      .then(({ data }) => {
        const filteredData = data.filter((service) => {
          const serviceModelIds = service.models.map((m) => m.id);
          return modelIds?.every((m) => serviceModelIds.includes(m)) ?? true;
        });
        setServices(filteredData);
      });
  }, [modelIds, providerId]);

  useEffect(() => {
    switch (milestoneType) {
      case milestoneTypes.milestone:
        setItem((curr) => ({ ...curr, sectionId: null, sectionName: null }));
        http.get('/maintenance-packages/milestones').then(({ data }) => {
          setMilestones(data);
        });
        break;
      case milestoneTypes.section:
        setItem((curr) => ({
          ...curr,
          milestoneId: null,
          milestoneValue: null,
        }));
        http.get('/service-type-details/sections/plain').then(({ data }) => {
          setSections(data);
        });
        break;
      default:
        return;
    }
  }, [milestoneType]);

  return (
    <>
      <Title>
        <h1>Create Maintenance Package</h1>
        <Button type="primary" onClick={() => form.submit()}>
          Submit
        </Button>
      </Title>
      <Content>
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Form.Item label="Package Type">
                <Radio.Group
                  value={milestoneType}
                  onChange={(event) => {
                    setMilestoneType(event.target.value);
                  }}
                >
                  <Radio value={0}>By Milestone</Radio>
                  <Radio value={1}>By Section</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="Package Name">
                <Input
                  value={item.packageName}
                  onChange={(event) =>
                    setItem((curr) => ({
                      ...curr,
                      packageName: event.target.value,
                    }))
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Milestone"
                hidden={milestoneType !== milestoneTypes.milestone}
              >
                <Select
                  value={
                    milestones.find((m) => m.milestone === item.milestoneValue)
                      ?.id
                  }
                  onChange={(_, option) =>
                    setItem((curr) => ({
                      ...curr,
                      milestoneId: option.value,
                      milestoneValue: option.label,
                    }))
                  }
                  options={milestones.map((m) => ({
                    label: m.milestone,
                    value: m.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Section"
                hidden={milestoneType !== milestoneTypes.section}
              >
                <Select
                  value={item.sectionId}
                  onChange={(value) =>
                    setItem((curr) => ({ ...curr, sectionId: value }))
                  }
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
                    checked:
                      item.services.findIndex(
                        (service) => service.id === rest.id
                      ) >= 0,
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
                          checked={record.checked}
                          onChange={() => {
                            const { checked, ...rest } = record;

                            const updatedServices = [...item.services];
                            const index = item.services.findIndex(
                              (service) => service.id === rest.id
                            );
                            if (index >= 0) {
                              updatedServices.splice(index, 1);
                            } else {
                              updatedServices.push(rest);
                            }
                            setItem((curr) => ({
                              ...curr,
                              services: updatedServices,
                            }));
                          }}
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
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    providerId: state.auth?.userData?.providerId,
  };
};

export default connect(mapStateToProps)(PackageForm);
