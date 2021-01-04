import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const NameContainer = styled.span`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
`;

export const Avatar = styled.div`
  height: 95%;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-image: ${({ imageUrl }) => `url(${imageUrl})`};
`;
