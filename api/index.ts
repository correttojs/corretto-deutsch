import { NowRequest, NowResponse } from '@now/node';
import { resolvers } from '../server/graphql/resolvers';
import { buildSchema, graphql } from 'graphql';
const types = require('../server/graphql/typedef.graphql');

export default function (req: NowRequest, res: NowResponse) {
  const qs = require('url').parse(req.url, true).query;
  console.log('REQUEST', req.url);
  graphql(buildSchema(types), qs.query, resolvers).then((result) => {
    console.log(result);
    res.end(JSON.stringify(result));
  });
}
