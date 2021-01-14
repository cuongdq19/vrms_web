import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Radio, Row, Select, Table } from 'antd';
import { connect } from 'react-redux';

import './package-create-and-update.styles.scss';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';
import { calculateServicePrice, formatMoney } from '../../utils';
import {
  loadPackageFormStart,
  fetchMilestonesStart,
  createPackageStart,
  updatePackageStart,
} from '../../redux/package/package.actions';
import { fetchSectionsStart } from '../../redux/section/section.actions';

const PackageCreateAndUpdate = ({
  history,
  services,
  isLoadingForm,
  milestones,
  sections,
  isCreatingOrUpdating,
  onLoadForm,
  onFetchMilestones,
  onFetchSections,
  onCreatePackage,
  onUpdatePackage,
}) => {
  const packageModelIds = history.location.state.modelIds || [];
  const item = history.location.state.item;
  const [form] = Form.useForm();
  const [isMilestone, setIsMilestone] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);

  const submitHandler = (values) => {
    if (item) {
      onUpdatePackage({ ...values, serviceIds: selectedServices, history });
    } else {
      onCreatePackage({ ...values, serviceIds: selectedServices, history });
    }
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
      //   ...getColumnSearchProps('name', handleSearch, handleReset, search),
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
  ];

  useEffect(() => {
    onLoadForm();
  }, [onLoadForm]);

  useEffect(() => {
    if (isMilestone) {
      onFetchMilestones();
    } else {
      onFetchSections();
    }
  }, [isMilestone, onFetchMilestones, onFetchSections]);

  useEffect(() => {
    if (item) {
      const { id, milestone, name, services, sectionId } = item;
      if (milestone) {
        setIsMilestone(true);
      } else {
        setIsMilestone(false);
      }
      setSelectedServices(services.map((item) => item.id));
      form.setFieldsValue({
        id,
        name,
        milestone,
        sectionId,
      });
    }
  }, [form, item]);

  const filteredServices = services.filter((service) => {
    const { models } = service;
    const modelIds = models.map((m) => m.id);
    return packageModelIds.every((sm) => modelIds.includes(sm));
  });

  return (
    <LayoutWrapper>
      {isLoadingForm || isCreatingOrUpdating ? (
        <LoadingSpinner title="Loading Data ..." />
      ) : (
        <>
          <Row gutter={[16, 16]} justify="space-between" align="middle">
            <Col>
              <h1>Create Package</h1>
            </Col>
            <Col>
              <Button type="primary" onClick={() => form.submit()}>
                Submit
              </Button>
            </Col>
          </Row>
          <Form form={form} layout="vertical" onFinish={submitHandler}>
            {item ? (
              <Form.Item hidden name="id">
                <Input />
              </Form.Item>
            ) : null}
            <Form.Item label="Package Type">
              <Radio.Group
                value={isMilestone}
                onChange={(event) => setIsMilestone(event.target.value)}
              >
                <Radio value={true}>MILESTONE</Radio>
                <Radio value={false}>SECTION</Radio>
              </Radio.Group>
            </Form.Item>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label="Package Name" name="name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                {isMilestone ? (
                  <Form.Item label="Milestone" name="milestone">
                    <Select
                      options={milestones.map((m) => ({
                        label: m.milestone,
                        value: m.milestone,
                      }))}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item label="Section" name="sectionId">
                    <Select
                      options={sections.map((m) => ({
                        label: m.sectionName,
                        value: m.sectionId,
                      }))}
                    />
                  </Form.Item>
                )}
              </Col>

              <Col span={24}>
                <Table
                  rowKey="id"
                  dataSource={filteredServices}
                  rowClassName={(record) =>
                    !record.parts.every((part) => !part.isDeleted)
                      ? 'row-warning'
                      : ''
                  }
                  rowSelection={{
                    selectedRowKeys: selectedServices,
                    onChange: (selectedRowKeys) =>
                      setSelectedServices(selectedRowKeys),
                  }}
                  columns={servicesColumns}
                  expandable={{
                    rowExpandable: (record) => record.parts.length > 0,
                    expandedRowRender: (record) => {
                      const partsColumns = [
                        { title: 'ID', dataIndex: 'id', align: 'center' },
                        {
                          title: 'Name',
                          dataIndex: 'name',
                          align: 'center',
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
              </Col>
            </Row>
          </Form>
        </>
      )}
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  services: state.services.services,
  milestones: state.packages.milestones,
  sections: state.sections.sections,
  isLoadingForm: state.packages.isLoadingForm,
  isCreatingOrUpdating: state.packages.isCreatingOrUpdating,
});

const mapDispatchToProps = (dispatch) => ({
  onLoadForm: () => dispatch(loadPackageFormStart()),
  onFetchMilestones: () => dispatch(fetchMilestonesStart()),
  onFetchSections: () => dispatch(fetchSectionsStart()),
  onCreatePackage: (newPackage) => dispatch(createPackageStart(newPackage)),
  onUpdatePackage: (updatedPackage) =>
    dispatch(updatePackageStart(updatedPackage)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageCreateAndUpdate);
