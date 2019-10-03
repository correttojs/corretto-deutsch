import React from 'react';
import './App.css';

import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './client';
import { SetList } from './SetList';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SetDetail } from './SetDetail';

const App: React.FC = () => {
  return (
  <ApolloProvider client={client}>
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
    
  </ApolloProvider>
  );
}

export default App;
