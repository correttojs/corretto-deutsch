import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { getFile } from './fileUploader';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typeDefs';
import { createServer } from 'http';
import { logger } from './logger';

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

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: process.env.PORT || 4000 }, () => {
  logger.info(`Server ready at http://localhost:4000${server.graphqlPath}`);
  logger.info(`Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`);
});
