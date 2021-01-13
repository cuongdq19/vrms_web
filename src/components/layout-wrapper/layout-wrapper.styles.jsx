import { Layout } from 'antd';
import styled from 'styled-components';

export const Profile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
`;

export const Logo = styled.div`
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
`;

export const CustomHeader = styled(Layout.Header)`
  padding: 0;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
`;

export const CollapsedIcon = styled.div`
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
`;

export const CustomContent = styled(Layout.Content)`
  margin: 24px 16px;
  padding: 24px;
  background-color: #fff;
`;
