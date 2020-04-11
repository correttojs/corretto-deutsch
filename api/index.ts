require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { getFile } from '../server/fileUploader';
import { typeDefs } from '../server/graphql/typedefs';
import { resolvers } from '../server/graphql/resolvers';

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
app.get('/audio/:path', (req, res) => {
  try {
    const readStream = getFile(req.params.path);
    if (readStream) {
      readStream.pipe(res);
    } else {
      res.status(404).json({ error: `${req.params.path} NOT FOUND` });
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});
app.use(express.static('build'));
server.applyMiddleware({ app });
app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
