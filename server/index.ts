// import * as fs from 'fs';
// import * as util from 'util';

// import { processText } from './processText';
// import { mergeAudio } from './mergeAudio';
// import { getFilePath } from './toFile';
// import { getSets, getTerms, getTerm, getAudio } from './quizlet';

require('dotenv').config();
import './server';

// const openFile = util.promisify(fs.readFile);

// const main = async (groupName: string): Promise<void> => {
//   const textList = await openFile(`./source/${groupName}.txt`, { encoding: 'utf-8' });

//   const res = await Promise.all(
//     textList.split(';').map((tuple, index) => {
//       const [text, translation] = tuple.split('$');
//       if (text) {
//         return processText(groupName, index, text, translation);
//       } else {
//         return Promise.resolve(null);
//       }
//     }),
//   );
//   mergeAudio(res.filter(s => s !== null) as string[], getFilePath(groupName, groupName), false);
// };
// // mergeAudio(['./audio/kleidung/audio_23.mp3', './audio/kleidung/audio_22.mp3'], 'test.mp3', false);
// // main('a2-3natur');
// // main('kleidung');

// const test = async () => {
//   const r = await getSets(107302659);
//   console.log(r);
//   const r2 = await getTerms(r[0].id);
//   console.log(r2[0]);
//   const r3 = await getTerm(r2[0].id);
//   console.log(r3);
//   console.log(getAudio(r3._wordAudioUrl));
// };
