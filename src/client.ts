import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import { persistCache } from 'apollo-cache-persist';

export const client = async () => {
  const cache = new InMemoryCache();
  // await persistCache({
  //   cache,
  //   storage: window.localStorage as any,
  // });
  return new ApolloClient({
    link: createHttpLink({ uri: '/graphql' }),
    cache,
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
    },
  });
};
