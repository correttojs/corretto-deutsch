import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import { client } from './client';
import { ApolloProvider } from '@apollo/react-hooks';

const init = async () => {
  const c = await client();
  ReactDOM.render(
    <ApolloProvider client={c}>
      <App />
    </ApolloProvider>,
    document.getElementById('root'),
  );
};

init();
