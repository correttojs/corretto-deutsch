import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Subscription {
    setUpdated: Set
  }
  type Term {
    id: ID!
    word: String!
    translation: String!
    wordAudio: String!
    translationAudio: String!
  }
  type Set {
    id: ID!
    title: String!
    terms: [Term]
    audio: String
  }

  type Mutation {
    mergeSetAudio(id: ID!): Set
    deleteSetAudio(id: ID!): Set
  }

  type Query {
    sets(feedId: ID!): [Set]
    set(id: ID!): Set
  }
`;
