import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import { persistCache } from 'apollo-cache-persist';

import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const wsLink = new WebSocketLink({
  uri: `ws://${window.location.host}/graphql`,
  options: {
    reconnect: true,
  },
});

const httpLink = createHttpLink({ uri: '/graphql' });

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

export const client = async () => {
  const cache = new InMemoryCache();
  await persistCache({
    cache,
    storage: window.localStorage as any,
  });
  return new ApolloClient({
    link,
    cache,
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
    },
  });
};
