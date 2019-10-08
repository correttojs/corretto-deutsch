import { getSet, getTerms, getSets, getAudio } from '../quizlet';
import { deleteFile, getS3PAth, uploadFile } from '../fileUploader';
import { mergeAudio } from '../mergeAudio';
import { getDirFiles } from '../toFile';
import { PubSub } from 'graphql-subscriptions';
import * as fse from 'fs-extra';
import { logger } from '../logger';

const pubsub = new PubSub();

const mapTerms = (t: any) => {
  return {
    id: t.id,
    word: t.word,
    translation: t.definition,
    wordAudio: getAudio(t._wordAudioUrl),
    translationAudio: getAudio(t._definitionAudioUrl),
  };
};

const SET_UPDATED = 'setUpdated';

const processAudio = async (set: any, distPath: string) => {
  try {
    logger.info('START PROCESSING');
    const terms = (await getTerms(set.id)).map(mapTerms);
    const dirPath = `./tmp/${set.title}`;

    await fse.ensureDir(dirPath);
    await Promise.all(
      terms.map(t => {
        return mergeAudio([t.wordAudio, t.translationAudio], `${dirPath}/${t.id}.mp3`, true);
      }),
    );
    const files = await getDirFiles(dirPath);
    await mergeAudio(files.map(f => `${dirPath}/${f}`), distPath, false);
    await fse.remove(dirPath);

    logger.info('UPLOADING');
    await uploadFile(distPath);

    pubsub.publish(SET_UPDATED, {
      title: set.title,
      id: set.id,
      audio: 'PROGRESS',
    });
    setTimeout(() => {
      async function t() {
        const s3Path = await getS3PAth(distPath);
        pubsub.publish(SET_UPDATED, {
          title: set.title,
          id: set.id,
          audio: s3Path,
        });
      }
      t();
    }, 5000);
  } catch (e) {
    logger.error(e);
  }
};

export const resolvers = {
  Subscription: {
    setUpdated: {
      resolve: payload => {
        logger.warn('WS', payload);
        return payload;
      },
      subscribe: () => pubsub.asyncIterator(SET_UPDATED),
    },
  },
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
      const distPath = `./audio/${set.title}.mp3`;
      const s3Path = await getS3PAth(distPath);
      if (s3Path) {
        return {
          title: set.title,
          id,
          audio: s3Path,
        };
      }
      processAudio(set, distPath);
      return {
        title: set.title,
        id,
        audio: 'PROGRESS',
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
