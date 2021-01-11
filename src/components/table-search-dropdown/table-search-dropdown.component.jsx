import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import {
  ButtonContainer,
  DropdownButton,
  DropdownContainer,
  DropdownInput,
} from './table-search-dropdown.styles';

const TableSearchDropdown = ({
  dataIndex,
  selectedKeys,
  setSelectedKeys,
  onSearch,
  confirm,
  onReset,
  clearFilters,
}) => {
  return (
    <DropdownContainer>
      <DropdownInput
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => onSearch(selectedKeys, confirm, dataIndex)}
      />
      <ButtonContainer>
        <DropdownButton
          type="primary"
          onClick={() => onSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
        >
          Search
        </DropdownButton>
        <DropdownButton onClick={() => onReset(clearFilters)} size="small">
          Reset
        </DropdownButton>
      </ButtonContainer>
    </DropdownContainer>
  );
};

export default TableSearchDropdown;
