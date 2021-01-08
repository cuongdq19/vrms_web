import React from 'react';

import { Container, NameContainer, Avatar } from './user-item.styles';

const UserItem = ({ fullName, imageUrl }) => {
  return (
    <Container>
      <NameContainer>{fullName}</NameContainer>
      <Avatar imageUrl={imageUrl} />
    </Container>
  );
};

export default UserItem;
