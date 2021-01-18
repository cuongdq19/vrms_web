import React, { useEffect, useState } from 'react';
import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Table,
} from 'antd';
import { connect } from 'react-redux';

import CustomModal from '../custom-modal/custom-modal.component';
import { fetchAddServiceModal } from '../../redux/request/request.actions';
import {
  fetchServiceTypesStart,
  fetchServiceTypesSectionsStart,
  fetchProviderServicesStart,
} from '../../redux/service/service.actions';
import { ServiceItemTypes } from '../../utils/constants';
import {
  calculatePackagePrice,
  calculateServicePrice,
  formatMoney,
} from '../../utils';

const INIT_EXPENSE = { name: '', note: '', price: 0, parts: [] };

const RequestUpdateAddServiceModal = ({
  visible,
  onCancel,
  modelId,
  onSubmit,
  ...otherProps
}) => {
  const {
    services,
    types,
    parts,
    typeSections,
    packages,
    onFetchAddServiceModal,
  } = otherProps; // Redux
  const [form] = Form.useForm();
  const [itemType, setItemType] = useState(ServiceItemTypes.SERVICES);
  const [selected, setSelected] = useState(INIT_EXPENSE);
  const [filters, setFilters] = useState({
    typeDetailId: 0,
  });

  const valueChangedHandler = (key, value) => {
    setSelected((curr) => ({ ...curr, [key]: value }));
  };

  const partSelectedHandler = (part) => {
    const updatedParts = [...(selected?.parts ?? [])];
    const index = updatedParts.findIndex((p) => p.id === part.id);
    if (index >= 0) {
      updatedParts[index].quantity++;
    } else {
      updatedParts.push({ ...part, quantity: 1 });
    }
    setSelected((curr) => ({ ...curr, parts: updatedParts }));
  };

  const partRemovedHandler = (part) => {
    const updatedParts = [...(selected?.parts ?? [])];
    const index = updatedParts.findIndex((p) => p.id === part.id);
    if (index >= 0) {
      if (updatedParts[index].quantity > 1) {
        updatedParts[index].quantity--;
      } else {
        updatedParts.splice(index, 1);
      }
    } else {
      updatedParts.push({ ...part, quantity: 1 });
    }
    setSelected((curr) => ({ ...curr, parts: updatedParts }));
  };

  const closedHandler = () => {
    form.resetFields();
    setSelected(INIT_EXPENSE);
    setFilters({
      typeDetailId: 0,
    });
    onCancel();
  };

  useEffect(() => {
    if (visible && modelId) {
      setSelected(INIT_EXPENSE);
      onFetchAddServiceModal({ itemType, modelId });
    }
  }, [itemType, modelId, onFetchAddServiceModal, visible]);

  const filteredServices = services
    .filter(
      (service) =>
        !filters.typeDetailId || service.typeDetail.id === filters.typeDetailId
    )
    .filter((service) => service.models.map((m) => m.id).includes(modelId));

  return (
    <CustomModal
      title="Add service to request"
      visible={visible}
      onCancel={closedHandler}
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={() => {
          const success = onSubmit(itemType, selected);
          if (success) {
            form.resetFields();
            setSelected(INIT_EXPENSE);
          }
        }}
      >
        <Form.Item label="Service Type">
          <Radio.Group
            value={itemType}
            onChange={(event) => {
              setSelected(INIT_EXPENSE);
              setItemType(event.target.value);
            }}
          >
            <Radio value={ServiceItemTypes.SERVICES}>
              {ServiceItemTypes.SERVICES}
            </Radio>
            <Radio value={ServiceItemTypes.EXPENSES}>
              {ServiceItemTypes.EXPENSES}
            </Radio>
            <Radio value={ServiceItemTypes.PACKAGES}>
              {ServiceItemTypes.PACKAGES}
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Row gutter={[16, 16]}>
          {itemType === ServiceItemTypes.SERVICES ? (
            <>
              <Col span={24}>
                <Form.Item label="Service">
                  <Cascader
                    onChange={(value) => {
                      if (!value.length) {
                        return setFilters((curr) => ({
                          ...curr,
                          typeDetailId: 0,
                        }));
                      }
                      setFilters((curr) => ({
                        ...curr,
                        typeDetailId: value[1],
                      }));
                    }}
                    options={types.map((type) => ({
                      label: type.name,
                      value: type.id,
                      children: typeSections
                        .filter((section) => section.typeId === type.id)
                        .map((section) => ({
                          label: section.sectionName,
                          value: section.id,
                          section,
                        })),
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Table
                  rowKey="id"
                  dataSource={filteredServices}
                  columns={[
                    {
                      title: 'ID',
                      dataIndex: 'id',
                      align: 'center',
                      render: (_, __, index) => index + 1,
                    },
                    { title: 'Name', dataIndex: 'name', align: 'center' },
                    {
                      title: 'Wages',
                      dataIndex: 'price',
                      align: 'center',
                      render: (value) => formatMoney(value),
                    },
                    {
                      title: 'Total Price',
                      align: 'center',
                      render: (_, record) => {
                        const total = calculateServicePrice(record);
                        return formatMoney(total);
                      },
                    },
                  ]}
                  rowSelection={{
                    type: 'radio',
                    selectedRowKeys: [selected?.id],
                    getCheckboxProps: (record) => ({
                      value: record.id,
                    }),
                    onSelect: (record) => {
                      setSelected(record);
                    },
                  }}
                  expandable={{
                    rowExpandable: (record) => record.parts.length > 0,
                    expandedRowRender: (record) => {
                      return (
                        <Table
                          rowKey="id"
                          dataSource={record.parts}
                          columns={[
                            { title: 'ID', dataIndex: 'id', align: 'center' },
                            {
                              title: 'Name',
                              dataIndex: 'name',
                              align: 'center',
                            },
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
                              title: 'Total Price',
                              align: 'center',
                              render: (_, record) =>
                                formatMoney(record.price * record.quantity),
                            },
                          ]}
                        />
                      );
                    },
                  }}
                />
              </Col>
            </>
          ) : null}
          {itemType === ServiceItemTypes.PACKAGES ? (
            <Col span={24}>
              <Table
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: [selected?.id],
                  getCheckboxProps: (record) => ({
                    value: record.id,
                  }),
                  onSelect: (record) => {
                    setSelected(record);
                  },
                }}
                dataSource={packages}
                rowKey="id"
                columns={[
                  { title: 'ID', dataIndex: 'id', align: 'center' },
                  { title: 'Name', dataIndex: 'name', align: 'center' },
                  {
                    title: 'Milestone / Section',
                    align: 'center',
                    render: (_, record) =>
                      record.sectionName || record.milestone + ` KM`,
                  },
                  {
                    title: 'Total Price',
                    align: 'center',
                    render: (_, record) => {
                      const total = calculatePackagePrice(record);
                      return formatMoney(total);
                    },
                  },
                ]}
                expandable={{
                  rowExpandable: (record) => record.services.length > 0,
                  expandedRowRender: (record) => {
                    return (
                      <Table
                        rowKey="id"
                        dataSource={record.services}
                        columns={[
                          {
                            title: 'ID',
                            dataIndex: 'id',
                            align: 'center',
                          },
                          { title: 'Name', dataIndex: 'name', align: 'center' },
                          {
                            title: 'Wages',
                            dataIndex: 'price',
                            align: 'center',
                            render: (value) => formatMoney(value),
                          },
                          {
                            title: 'Total Price',
                            align: 'center',
                            render: (_, record) => {
                              const total = calculateServicePrice(record);
                              return formatMoney(total);
                            },
                          },
                        ]}
                        expandable={{
                          rowExpandable: (record) => record.parts.length > 0,
                          expandedRowRender: (record) => {
                            return (
                              <Table
                                rowKey="id"
                                dataSource={record.parts}
                                columns={[
                                  {
                                    title: 'ID',
                                    dataIndex: 'id',
                                    align: 'center',
                                  },
                                  {
                                    title: 'Name',
                                    dataIndex: 'name',
                                    align: 'center',
                                  },
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
                                    title: 'Total Price',
                                    align: 'center',
                                    render: (_, record) =>
                                      formatMoney(
                                        record.price * record.quantity
                                      ),
                                  },
                                ]}
                              />
                            );
                          },
                        }}
                      />
                    );
                  },
                }}
              />
            </Col>
          ) : null}
          {itemType === ServiceItemTypes.EXPENSES ? (
            <>
              <Col span={8}>
                <Form.Item
                  label="Service"
                  name="name"
                  rules={[{ required: true, message: "Name can't be blank" }]}
                >
                  <Input
                    value={selected?.name}
                    onChange={(event) =>
                      valueChangedHandler('name', event.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Note"
                  name="note"
                  rules={[{ required: true, message: "Note can't be blank" }]}
                >
                  <Input
                    value={selected?.note}
                    onChange={(event) =>
                      valueChangedHandler('note', event.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: "Price can't be blank" }]}
                >
                  <InputNumber
                    type="number"
                    min={0}
                    value={selected?.price}
                    onChange={(value) => valueChangedHandler('price', value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Table
                  size="small"
                  pagination={{ pageSize: 5 }}
                  dataSource={parts}
                  rowKey="id"
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
                          size="small"
                          onClick={() => partSelectedHandler(record)}
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
                  size="small"
                  pagination={{ pageSize: 5 }}
                  dataSource={selected?.parts}
                  rowKey="id"
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
                    {
                      title: 'Remove',
                      align: 'center',
                      render: (_, record) => (
                        <Button
                          danger
                          size="small"
                          onClick={() => partRemovedHandler(record)}
                        >
                          Remove
                        </Button>
                      ),
                    },
                  ]}
                />
              </Col>
            </>
          ) : null}
        </Row>
      </Form>
    </CustomModal>
  );
};

const mapStateToProps = (state) => ({
  parts: state.parts.parts,
  services: state.services.services,
  types: state.services.types,
  typeSections: state.services.typeSections,
  packages: state.packages.packages,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchProviderServices: () => dispatch(fetchProviderServicesStart()),
  onFetchServiceTypes: () => dispatch(fetchServiceTypesStart()),
  onFetchTypeSections: () => dispatch(fetchServiceTypesSectionsStart()),
  onFetchAddServiceModal: ({ itemType, modelId }) =>
    dispatch(fetchAddServiceModal({ itemType, modelId })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestUpdateAddServiceModal);
