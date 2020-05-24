import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PageLoading } from '../components/PageLoading';
import pages from '../pages';
import { routeConfig } from './routeConfig';

export default () => {
  return (
    <React.Suspense fallback={<PageLoading />}>
      <Switch>
        {routeConfig.map((ele, index: number) => {
          return (
            <Route
              exact={ele.component === "Admin" ? false : true}
              key={index + ''}
              path={ele.path}
              component={pages[ele.component]}
            />
          );
        })}
      </Switch>
    </React.Suspense>
  );
};
