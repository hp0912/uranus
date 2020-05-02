import React from 'react';
import DocumentTitle from 'react-document-title';
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
              exact
              key={index + ''}
              path={ele.path}
              render={props => {
                const Component = pages[ele.component];
                const WrapComponent = (
                  <DocumentTitle title={ele.title}>
                    <Component {...props} />
                  </DocumentTitle>
                );
                return WrapComponent;
              }}
            />
          );
        })}
      </Switch>
    </React.Suspense>
  );
};
