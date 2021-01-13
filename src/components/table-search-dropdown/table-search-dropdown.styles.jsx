import { Button, Input } from 'antd';
import styled from 'styled-components';

export const DropdownContainer = styled.div`
  padding: 8px;
`;

export const DropdownInput = styled(Input)`
  padding: 8px;
  width: 100%;
  margin-bottom: 8px;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DropdownButton = styled(Button)`
  flex: 1;
`;
