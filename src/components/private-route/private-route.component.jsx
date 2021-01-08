import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const currentUser = useSelector((state) => state.auth.userData);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser) {
          return (
            <Redirect
              to={{ pathname: '/sign-in', state: { from: props.location } }}
            />
          );
        }

        if (roles && roles.indexOf(currentUser.roleName) === -1) {
          return <Redirect to={{ pathname: '/' }} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
