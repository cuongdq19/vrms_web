import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Content, Title } from './package-form.styles';
import './package-form.styles.scss';
import LoadingSpinner from '../loading-spinner/loading-spinner.component';

import http from '../../http';
import { getColumnSearchProps } from '../../utils/antd';
import { calculateServicePrice, formatMoney } from '../../utils';

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
  const [loading, setLoading] = useState(false);

  const [item, setItem] = useState(INIT_PACKAGE);
  const [milestones, setMilestones] = useState([]);
  const [sections, setSections] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearch({ searchText: '' });
  };

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

  const servicesColumns = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: 'Service Name',
      dataIndex: 'name',
      align: 'center',
      ...getColumnSearchProps('name', handleSearch, handleReset, search),
    },
    {
      title: 'Wages',
      dataIndex: 'price',
      align: 'center',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Total Price',
      align: 'center',
      render: (_, record) => formatMoney(calculateServicePrice(record)),
    },
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
  ];

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
    setLoading(true);
    switch (milestoneType) {
      case milestoneTypes.milestone:
        setItem((curr) => ({ ...curr, sectionId: null, sectionName: null }));
        http.get('/maintenance-packages/milestones').then(({ data }) => {
          setMilestones(data);
          setLoading(false);
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
          setLoading(false);
        });
        break;
      default:
        setLoading(false);
        return;
    }
  }, [milestoneType]);

  return loading ? (
    <LoadingSpinner />
  ) : (
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
              <Form.Item
                label="Package Name"
                name="packageName"
                initialValue={item?.packageName}
                rules={[
                  { required: true, message: "Package name can't be blank" },
                ]}
              >
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
                name="milestoneId"
                initialValue={item?.milestoneId}
                rules={[
                  ({ getFieldValue }) => ({
                    validator() {
                      if (
                        milestoneType === milestoneTypes.milestone &&
                        item.milestoneId > 0
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Milestone can't be blank");
                    },
                  }),
                ]}
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
                initialValue={item?.sectionId}
                name="sectionId"
                rules={[
                  ({ getFieldValue }) => ({
                    validator() {
                      if (
                        milestoneType === milestoneTypes.section &&
                        item.sectionId > 0
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Milestone can't be blank");
                    },
                  }),
                ]}
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
              <Form.Item
                label="Services"
                name="serviceIds"
                rules={[
                  ({ getFieldValue }) => ({
                    validator() {
                      if (
                        item.services.filter((service) => service.checked)
                          .length > 0
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Services can't be empty");
                    },
                  }),
                ]}
              >
                <Table
                  rowClassName={(record) =>
                    !record.parts.every((part) => !part.isDeleted)
                      ? 'row-warning'
                      : ''
                  }
                  dataSource={services.map((service) => ({
                    checked:
                      item.services.findIndex(
                        (item) => item.id === service.id
                      ) >= 0,
                    ...service,
                  }))}
                  rowKey="id"
                  columns={servicesColumns}
                  expandable={{
                    rowExpandable: (record) => {
                      return record.parts.length > 0;
                    },
                    expandedRowRender: (record) => {
                      const partsColumns = [
                        { title: 'ID', dataIndex: 'id', align: 'center' },
                        {
                          title: 'Name',
                          dataIndex: 'name',
                          align: 'center',
                          ...getColumnSearchProps(
                            'name',
                            handleSearch,
                            handleReset,
                            search
                          ),
                        },
                        {
                          title: 'Category',
                          dataIndex: 'categoryName',
                          align: 'center',
                        },

                        {
                          title: 'Description',
                          dataIndex: 'description',
                          align: 'center',
                          ellipsis: true,
                        },

                        {
                          title: 'Price',
                          dataIndex: 'price',
                          render: (value) => formatMoney(value),
                          align: 'center',
                        },
                        {
                          title: 'Quantity',
                          dataIndex: 'quantity',
                          align: 'center',
                        },
                        {
                          title: 'Total Price',
                          align: 'center',
                          render: (_, record) =>
                            formatMoney(record.price * record.quantity),
                        },
                      ];
                      return (
                        <Table
                          loading={loading}
                          rowKey="id"
                          rowClassName={(record) =>
                            record.isDeleted ? 'row-warning' : ''
                          }
                          pagination={{ pageSize: 5 }}
                          dataSource={record.parts}
                          columns={partsColumns}
                        />
                      );
                    },
                  }}
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
