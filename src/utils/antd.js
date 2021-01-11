import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import Highlighter from 'react-highlight-words';

import TableSearchDropdown from '../components/table-search-dropdown/table-search-dropdown.component';

export const getColumnSearchProps = (
  dataIndex,
  onSearch,
  onReset,
  searchValue
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <TableSearchDropdown
      dataIndex={dataIndex}
      selectedKeys={selectedKeys}
      setSelectedKeys={setSelectedKeys}
      confirm={confirm}
      clearFilters={clearFilters}
      onSearch={onSearch}
      onReset={onReset}
    />
  ),
  filterIcon: (filtered) => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : '',

  render: (text) =>
    searchValue.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchValue.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ),
});
