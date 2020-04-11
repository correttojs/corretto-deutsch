import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as util from 'util';

import { deleteFile, getS3PAth, uploadFile } from '../fileUploader';
// import { getAudio, getSet, getSets, getTerms } from '../mergeAudio';
import { getAudio, getSet, getSets, getTerms } from '../quizlet';
import { textToMp3 } from '../textToMp3';
import { getDirFiles } from '../toFile';
import { mergeAudio } from '../mergeAudio';

const mapTerms = (t: any) => {
  return {
    id: t.id,
    word: t.word,
    translation: t.definition,
    wordAudio: getAudio(t._wordAudioUrl),
    translationAudio: getAudio(t._definitionAudioUrl),
  };
};

export const resolvers = {
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
      const fileTitle = set.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const dirPath = `./tmp/${fileTitle}`;
      const distPath = `./audio/${fileTitle}.mp3`;
      // const s3Path = await getS3PAth(distPath);
      // if (s3Path) {
      //   return {
      //     title: fileTitle,
      //     id,
      //     audio: s3Path,
      //   };
      // }
      await fse.ensureDir(dirPath);
      const data = await textToMp3(set.title, 'de-DE');
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(dirPath + '/0_title.mp3', data, 'binary');
      await Promise.all(
        terms.map((t) => {
          return mergeAudio([t.wordAudio, t.translationAudio], `${dirPath}/${t.id}.mp3`, true);
        }),
      );
      const files = await getDirFiles(dirPath);
      await mergeAudio(
        files.map((f) => `${dirPath}/${f}`),
        distPath,
        false,
      );
      // await fse.remove(dirPath);
      // await uploadFile(distPath);
      return {
        title: fileTitle,
        id,
        terms,
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

      // const distPath = `./audio/${set.title}.mp3`;
      // const s3Path = await getS3PAth(distPath);
      return {
        id,
        title: set.title,
        terms: terms.map(mapTerms),
        audio: '', // s3Path,
      };
    },
    sets: async (_, { feedId }: { feedId: number }) => {
      const sets = await Promise.all(
        (await getSets(feedId)).map(async (s) => {
          // const distPath = `./audio/${s.title}.mp3`;
          // const s3Path = await getS3PAth(distPath);
          return {
            id: s.id,
            title: s.title,
            audio: '', // s3Path,
          };
        }),
      );
      return sets;
    },
  },
};
