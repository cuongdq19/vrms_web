import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { connect } from 'react-redux';
import styled from 'styled-components';

import LayoutWrapper from '../components/layout-wrapper/layout-wrapper.component';
import PackageCreateButton from '../components/PackageCreateButton';

import * as actions from '../store/actions';
import { formatMoney } from '../utils';

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Packages = ({ packagesData, loading, onFetchPackages }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  useEffect(() => {
    onFetchPackages();
  }, [onFetchPackages]);
  return (
    <LayoutWrapper>
      <StyledHeader>
        <h1>Packages</h1>
        <PackageCreateButton>Create</PackageCreateButton>
      </StyledHeader>
      <div>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={packagesData}
          columns={[
            { title: 'ID', dataIndex: 'id', align: 'center' },
            { title: 'Name', dataIndex: 'name', align: 'center' },
            { title: 'Section', dataIndex: 'sectionName', align: 'center' },
            {
              title: 'Price',
              align: 'center',
              render: (_, record) => {
                const { packagedServices: services } = record;
                const value = services.reduce((curr, service) => {
                  const { price: servicePrice, parts } = service;
                  const partsPrice = parts.reduce((curr, part) => {
                    return curr + part.price * part.quantity;
                  }, 0);

                  return curr + servicePrice + partsPrice;
                }, 0);
                return formatMoney(value);
              },
            },
          ]}
          expandable={{
            onExpandedRowsChange: (expandedKeys) => {
              const latestExpandedKey = expandedKeys[expandedKeys.length - 1];
              setExpandedRowKeys([latestExpandedKey]);
            },
            expandedRowKeys: expandedRowKeys,
            expandedRowRender: (record) => {
              return (
                <Table
                  title={() => <Typography.Text>Services</Typography.Text>}
                  dataSource={record.packagedServices}
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
                  ]}
                  expandable={{
                    rowExpandable: (record) => record.parts.length > 0,
                    expandedRowRender: (record) => {
                      return (
                        <Table
                          title={() => 'Parts'}
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
              );
            },
          }}
        />
      </div>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    packagesData: state.packages.packages,
    loading: state.packages.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchPackages: () => dispatch(actions.fetchServicePackages()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Packages);
