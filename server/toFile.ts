import * as fs from 'fs';
import * as util from 'util';

export const getDir = (group: string) => {
  return `./audio/${group}`;
};
export const getFilePath = (group: string, text: string) => {
  return `./audio/${group}/audio_${text}.mp3`;
};

export const toFile = async (group: string, data: any, target: string) => {
  const outputPath = getFilePath(group, target);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(outputPath, data, 'binary');
  return outputPath;
};

export const getDirFiles = async (path: string) => {
  const readdir = util.promisify(fs.readdir);
  return await readdir(path);
};
