import React from 'react';

import { ApolloProvider } from '@apollo/react-hooks';
import { client } from '../client';
import { SetList } from '../SetList';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SetDetail } from '../SetDetail';
import { Grommet, Box } from 'grommet';

import { QueryParamProvider } from 'use-query-params';

const theme = {
  global: {
    font: {
      family: 'Roboto',
    },
  },
};

const App: React.FC = () => {
  return (
    <Grommet theme={theme} full={true}>
      <ApolloProvider client={client}>
        <Box direction="row" border={{ color: 'brand', size: 'large' }} pad="medium">
          <Router>
            <QueryParamProvider ReactRouterRoute={Route}>
              <Switch>
                <Route path="/set/:id">
                  <SetDetail />
                </Route>
                <Route path="/">
                  <SetList />
                </Route>
              </Switch>
            </QueryParamProvider>
          </Router>
        </Box>
      </ApolloProvider>
    </Grommet>
  );
};

export default App;
