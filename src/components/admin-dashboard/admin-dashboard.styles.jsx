import styled from 'styled-components';

export const Container = styled.div`
  background-color: whitesmoke;
  min-width: ${({ isChart }) => (isChart ? `400px` : '0px')};
  padding: 8px;
  border-radius: 0.125rem;

  --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
`;
