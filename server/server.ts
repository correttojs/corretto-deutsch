import { ApolloServer, gql } from 'apollo-server-express';
import { getSets, getTerms, getAudio, getSet } from './quizlet';
import { mergeAudio } from './mergeAudio';
import * as fse from 'fs-extra';
import { getDirFiles } from './toFile';
import * as express from 'express';
import { getS3PAth, uploadFile, deleteFile } from './fileUploader';

const typeDefs = gql`
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

const mapTerms = (t: any) => {
  return {
    id: t.id,
    word: t.word,
    translation: t.definition,
    wordAudio: getAudio(t._wordAudioUrl),
    translationAudio: getAudio(t._definitionAudioUrl),
  };
};

const resolvers = {
  Mutation: {
    deleteSetAudio: async (_, { id }: { id: number }) => {
      const set = await getSet(id);
      if (!set) {
        throw new Error('Invalid set id');
      }

      const distPath = `./audio/${set.title}.mp3`;
      await deleteFile(distPath);
      return {
        title: set.title,
        id,
        audio: null,
      };
    },
    mergeSetAudio: async (_, { id }: { id: number }) => {
      const set = await getSet(id);
      if (!set) {
        throw new Error('Invalid set id');
      }
      const terms = (await getTerms(id)).map(mapTerms);
      const dirPath = `./tmp/${set.title}`;
      const distPath = `./audio/${set.title}.mp3`;
      const s3Path = await getS3PAth(distPath);
      if (s3Path) {
        return {
          title: set.title,
          id,
          audio: s3Path,
        };
      }
      await fse.ensureDir(dirPath);

      await Promise.all(
        terms.map(t => {
          return mergeAudio([t.wordAudio, t.translationAudio], `${dirPath}/${t.id}.mp3`, true);
        }),
      );
      const files = await getDirFiles(dirPath);
      await mergeAudio(files.map(f => `${dirPath}/${f}`), distPath, false);
      await fse.remove(dirPath);
      await uploadFile(distPath);
      return {
        title: set.title,
        id,
        audio: distPath.replace('./', '/'),
      };
    },
  },
  Query: {
    set: async (_, { id }: { id: number }) => {
      const set = await getSet(id);
      if (!set) {
        throw new Error('Invalid set id');
      }
      const terms = await getTerms(id);

      const distPath = `./audio/${set.title}.mp3`;
      const s3Path = await getS3PAth(distPath);
      return {
        id,
        title: set.title,
        terms: terms.map(mapTerms),
        audio: s3Path,
      };
    },
    sets: async (_, { feedId }: { feedId: number }) => {
      const sets = await Promise.all(
        (await getSets(feedId)).map(async s => {
          const distPath = `./audio/${s.title}.mp3`;
          const s3Path = await getS3PAth(distPath);
          return {
            id: s.id,
            title: s.title,
            audio: s3Path,
          };
        }),
      );
      return sets;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
app.use('/audio', express.static('audio'));
app.use(express.static('build'));
server.applyMiddleware({ app });
app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
