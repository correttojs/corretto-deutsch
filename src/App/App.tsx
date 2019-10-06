import React from 'react';

import { SetList } from '../SetList';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SetDetail } from '../SetDetail';
import { Grommet, Box } from 'grommet';

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
      <Box direction="row" border={{ color: 'brand', size: 'large' }} pad="medium">
        <Router>
          <Switch>
            <Route path="/set/:id">
              <SetDetail />
            </Route>
            <Route path="/">
              <SetList />
            </Route>
          </Switch>
        </Router>
      </Box>
    </Grommet>
  );
};

export default App;
