import { textToMp3 } from './textToMp3';
import { translateText } from './translateText';
import { toFile, getFilePath, getDir } from './toFile';
import { mergeAudio } from './mergeAudio';
import * as fse from 'fs-extra';

export const processText = async (
  group: string,
  index: number,
  text: string,
  translation?: string,
) => {
  await fse.ensureDir(getDir(group));
  const fileExist = await fse.pathExists(getFilePath(group, index.toString()));
  if (fileExist) {
    return getFilePath(group, index.toString());
  }
  const audioOriginal = await textToMp3(text, 'de-DE');
  const translatedText = translation || (await translateText(text));
  const audioTranslated = await textToMp3(translatedText, 'it-IT');
  const originalPath = `${index}_original`;
  const translatedPath = `${index}_translated`;
  await toFile(group, audioOriginal, originalPath);
  await toFile(group, audioTranslated, translatedPath);
  await mergeAudio(
    [getFilePath(group, originalPath), getFilePath(group, translatedPath)],
    getFilePath(group, index.toString()),
    true,
  );
  fse.remove(getFilePath(group, originalPath));
  fse.remove(getFilePath(group, translatedPath));
  return getFilePath(group, index.toString());
};
