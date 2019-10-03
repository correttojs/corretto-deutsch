import { ApolloServer, gql } from 'apollo-server-express';
import { getSets, getTerms, getAudio, getSet } from './quizlet';
import { mergeAudio } from './mergeAudio';
import * as fse from 'fs-extra';
import { getDirFiles } from './toFile';
import * as express from 'express';
import * as bodyParser from 'body-parser';


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
    sets: [Set]
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
      await fse.remove(distPath);
      return {
        title: set.title,
        id,
        audio: null,
      }
    },
    mergeSetAudio: async (_, { id }: { id: number }) => {
      const set = await getSet(id);
      if (!set) {
        throw new Error('Invalid set id');
      }
      const terms = (await getTerms(id)).map(mapTerms);
      const dirPath = `./tmp/${set.title}`;
      const distPath = `./audio/${set.title}.mp3`;
      if(fse.existsSync(distPath)){
        return {
          title: set.title,
          id,
          audio: distPath,
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
      return {
        title: set.title,
        id,
        audio: distPath,
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
      return {
        id,
        title: set.title,
        terms: terms.map(mapTerms),
      };
    },
    sets: async () => {
      const sets = (await getSets(107302659)).map(s => ({ id: s.id, title: s.title, terms: [] }));
      // await Promise.all(
      //   sets.map(async (s, i) => {
      //     const terms = await getTerms(s.id);
      //     sets[i].terms = terms.map(mapTerms);
      //   }),
      // );

      return sets;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
app.use('/audio', express.static('audio'))
app.use(express.static('build'))
server.applyMiddleware({ app });
app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);