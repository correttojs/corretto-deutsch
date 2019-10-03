import React from 'react';
import './App.css';

import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './client';
import { SetList } from './SetList';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SetDetail } from './SetDetail';
import {Grommet, Box} from 'grommet';

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
          <Box
  direction="row"
  border={{ color: 'brand', size: 'large' }}
  pad="medium"
>
     <Router>
     <Switch>
          <Route path="/set/:id">
            <SetDetail />
          </Route>
          <Route path="/">
          <SetList/>
          </Route>
        </Switch>
     </Router>
</Box>
    
  </ApolloProvider>
  </Grommet>
  );
}

export default App;
