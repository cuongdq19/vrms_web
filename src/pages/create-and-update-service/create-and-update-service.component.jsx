import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Table,
} from 'antd';
import _ from 'lodash';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner.component';

import { formatMoney, modelToString } from '../../utils';
import {
  createServiceWithPartsStart,
  createServiceWithoutPartsStart,
  loadFormStart,
  updateServiceWithPartsStart,
  updateServiceWithoutPartsStart,
} from '../../redux/service/service.actions';
import { fetchPartsStart } from '../../redux/part/part.actions';
import { getColumnSearchProps } from '../../utils/antd';

const CreateAndUpdateServicePage = ({
  providerId,
  manufacturers,
  models,
  types,
  typeSections,
  parts,
  isLoadingForm,
  history,
  onFetchParts,
  onLoadForm,
  onCreateServiceWithParts,
  onCreateServiceWithoutParts,
  onUpdateServiceWithParts,
  onUpdateServiceWithoutParts,
}) => {
  const item = history.location.state?.item;
  const [form] = Form.useForm();

  const [isWithParts, setIsWithParts] = useState(false);
  const [filters, setFilters] = useState({
    manufacturerId: 0,
    partModelIds: [],
  });
  const [selectedParts, setSelectedParts] = useState([]);

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

  const addPart = (part) => {
    const updatedSelected = [...selectedParts];
    const index = updatedSelected.findIndex((item) => item.id === part.id);
    if (index >= 0) {
      updatedSelected[index].quantity++;
    } else {
      updatedSelected.push({ ...part, quantity: 1 });
      form.setFieldsValue({
        modelIds: _.intersection(
          ...updatedSelected.map((item) => item.models.map((model) => model.id))
        ),
      });
    }
    setSelectedParts(updatedSelected);
  };

  const removePart = (id) => {
    const updatedSelected = [...selectedParts];
    const index = updatedSelected.findIndex((item) => item.id === id);
    if (index < 0) {
      return;
    }
    if (updatedSelected[index].quantity > 1) {
      updatedSelected[index].quantity--;
    } else {
      updatedSelected.splice(index, 1);
      form.setFieldsValue({
        modelIds: _.intersection(
          ...updatedSelected.map((item) => item.models.map((model) => model.id))
        ),
      });
    }
    setSelectedParts(updatedSelected);
  };

  const switchPartMode = (value) => {
    setIsWithParts(value);
    if (value) {
      onFetchParts(providerId);
    }
  };

  const submitHandler = (values) => {
    if (item) {
      // Update
      if (isWithParts) {
        onUpdateServiceWithParts({
          ...values,
          parts: selectedParts,
          history,
        });
      } else {
        onUpdateServiceWithoutParts({ ...values, history });
      }
    } else {
      // Create
      if (isWithParts) {
        onCreateServiceWithParts({
          ...values,
          parts: selectedParts,
          history,
          providerId,
        });
      } else {
        onCreateServiceWithoutParts({ ...values, history, providerId });
      }
    }
  };

  useEffect(() => {
    onLoadForm();
  }, [onLoadForm]);

  useEffect(() => {
    if (isWithParts) {
      onFetchParts(providerId);
    }
  }, [isWithParts, onFetchParts, providerId]);

  console.log(selectedParts);

  useEffect(() => {
    if (item) {
      const { typeDetail, name, price, models, id, parts: itemParts } = item;
      if (itemParts.length) {
        setIsWithParts(true);
        setSelectedParts(
          itemParts.map(({ id, ...rest }) => ({
            ...rest,
            models,
            id,
          }))
        );
      }
      form.setFieldsValue({
        id,
        typeDetailId: [typeDetail.typeId, typeDetail.id],
        name,
        price,
        modelIds: models.map((model) => model.id),
      });
    }
  }, [form, item, parts]);

  const filteredModels = models.filter((m) =>
    filters.manufacturerId <= 0
      ? true
      : filters.manufacturerId === m.manufacturerId
  );

  const filteredParts = parts.filter((p) => {
    if (!filters.partModelIds.length) {
      return true;
    }
    const pModelIds = p.models.map((m) => m.id);
    return filters.partModelIds.every((id) => pModelIds.includes(id));
  });

  return (
    <LayoutWrapper>
      {isLoadingForm ? (
        <LoadingSpinner title="Loading Data" />
      ) : (
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <Row justify="space-between" gutter={[16, 16]}>
            <Col>
              <h1>{item ? 'Update Service' : 'New Service'}</h1>
            </Col>
            <Col>
              <Button type="primary" onClick={() => form.submit()}>
                Submit
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              {item ? (
                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>
              ) : null}
              <Form.Item
                label="Service"
                name="typeDetailId"
                rules={[{ required: true, message: "Service can't be blank." }]}
              >
                <Cascader
                  options={types.map((type) => {
                    return {
                      label: type.name,
                      value: type.id,
                      children: typeSections
                        .filter((sect) => sect.typeId === type.id)
                        .map((sect) => ({
                          label: sect.sectionName,
                          value: sect.id,
                        })),
                    };
                  })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Name can't be blank." }]}
              >
                <Input placeholder="Service Name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Manufacturers">
                <Select
                  disabled={isWithParts}
                  allowClear
                  onClear={() => {
                    setFilters((curr) => ({ ...curr, manufacturerId: 0 }));
                  }}
                  onSelect={(value) => {
                    setFilters((curr) => ({ ...curr, manufacturerId: value }));
                  }}
                  options={manufacturers.map((m) => ({
                    label: m.name,
                    value: m.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Models"
                name="modelIds"
                rules={[
                  {
                    required: true,
                    message: "Models can't be blank.",
                    type: 'array',
                    min: 1,
                  },
                ]}
              >
                <Select
                  disabled={isWithParts}
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    return (
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    );
                  }}
                  mode="multiple"
                  onClear={() =>
                    setFilters((curr) => ({ ...curr, partModelIds: [] }))
                  }
                  onChange={(value) =>
                    setFilters((curr) => ({ ...curr, partModelIds: value }))
                  }
                  options={filteredModels.map((m) => ({
                    label: modelToString(m),
                    value: m.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Price can't be blank." }]}
              >
                <InputNumber type="number" min={0} />
              </Form.Item>
            </Col>
            {!item ? (
              <Col span={24}>
                <Form.Item
                  initialValue={false}
                  label="With Parts"
                  name="isWithParts"
                  rules={[
                    ({ getFieldValue }) => ({
                      required: true,
                      validator(_, value) {
                        if (isWithParts && selectedParts.length === 0) {
                          return Promise.reject("Parts can't be blank.");
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Radio.Group
                    value={isWithParts}
                    onChange={(event) => {
                      switchPartMode(event.target.value);
                    }}
                  >
                    <Radio value={true}>With Parts</Radio>
                    <Radio value={false}>Without Parts</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            ) : null}
            {isWithParts ? (
              <>
                <Col span={12}>
                  <Table
                    title={() => <h1>Available Parts</h1>}
                    rowKey="id"
                    dataSource={filteredParts}
                    columns={[
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
                        title: 'Price',
                        dataIndex: 'price',
                        render: (value) => formatMoney(value),
                        align: 'center',
                      },
                      {
                        title: 'Add',
                        render: (_, record) => (
                          <Button onClick={() => addPart(record)}>
                            Add To List
                          </Button>
                        ),
                        align: 'center',
                      },
                    ]}
                  />
                </Col>

                <Col span={12}>
                  <Table
                    title={() => <h1>Selected Parts</h1>}
                    rowKey="id"
                    dataSource={selectedParts}
                    columns={[
                      { title: 'ID', dataIndex: 'id', align: 'center' },
                      {
                        title: 'Name',
                        dataIndex: 'name',
                        align: 'center',
                      },
                      {
                        title: 'Quantity',
                        dataIndex: 'quantity',
                        align: 'center',
                      },
                      {
                        title: 'Remove',
                        align: 'center',
                        render: (_, record) => (
                          <Button danger onClick={() => removePart(record.id)}>
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
      )}
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  isLoadingForm: state.services.isLoadingForm,
  providerId: state.auth.userData?.providerId,
  manufacturers: state.manufacturers.manufacturers,
  models: state.models.models,
  types: state.services.types,
  parts: state.parts.parts,
  typeSections: state.services.typeSections,
});

const mapDispatchToProps = (dispatch) => ({
  onLoadForm: () => dispatch(loadFormStart()),
  onFetchParts: (providerId) => dispatch(fetchPartsStart(providerId)),
  onCreateServiceWithParts: (newService) =>
    dispatch(createServiceWithPartsStart(newService)),
  onCreateServiceWithoutParts: (newService) =>
    dispatch(createServiceWithoutPartsStart(newService)),
  onUpdateServiceWithParts: (updatedService) =>
    dispatch(updateServiceWithPartsStart(updatedService)),
  onUpdateServiceWithoutParts: (updatedService) =>
    dispatch(updateServiceWithoutPartsStart(updatedService)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAndUpdateServicePage);
