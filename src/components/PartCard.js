import { Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import PartUpdateButton from './PartUpdateButton';

const Card = styled.div`
  width: 100%;
  height: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 10px;
`;

const Title = styled(Typography.Title)`
  flex: 1;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const Buttons = styled.div`
  width: 60%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const ImageContainer = styled.div`
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const PartCard = ({ part, onSuccess }) => {
  return (
    <Card>
      <Title level={4}>{part.name}</Title>
      <ImageContainer>
        <Image src={part.imageUrls[0]} alt={part.name} />
      </ImageContainer>
      <Footer>
        <Typography.Title level={4} style={{ marginBottom: 0 }}>
          {part.price}
        </Typography.Title>
        <Buttons>
          <PartUpdateButton onSuccess={onSuccess} part={part}>
            Update
          </PartUpdateButton>
        </Buttons>
      </Footer>
    </Card>
  );
};

export default PartCard;
