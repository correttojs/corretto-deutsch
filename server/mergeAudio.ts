process.env.FFPROBE_PATH = require('ffprobe-static').path;
process.env.FFMPEG_PATH = require('ffmpeg-static');

import * as ffmpeg from 'fluent-ffmpeg';

const SILENCE = './audio/silence1.mp3';
const BUTTON = './audio/button.mp3';
const nullAudio = 'https://quizlet.com/null';

console.log('FFPROBE_PATH', process.env.FFPROBE_PATH);
console.log('FFMPEG_PATH', process.env.FFMPEG_PATH);

ffmpeg(BUTTON).ffprobe(function (err, data) {
  console.log('file2 metadata:' + data?.format?.filename);
});
export const mergeAudio = (source: string[], target: string, twice: boolean) => {
  console.log('merging');
  source = source.map((i) => (i === nullAudio ? SILENCE : i));
  return new Promise((resolve, reject) => {
    const f = ffmpeg();
    if (twice) {
      f.input(source[0])
        .input(SILENCE)
        .input(source[1])
        .input(SILENCE)
        .input(source[0])
        .input(SILENCE);
    } else {
      source.forEach((s) => {
        if (s) {
          f.input(s).input(BUTTON).input(SILENCE);
        }
      });
    }

    f.on('start', function (commandLine) {
      // console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
      // .on('progress', function(progress) {
      //   console.log('Processing: ' + progress.percent + '% done');
      // })
      // .on('stderr', function(stderrLine) {
      //   console.log('Stderr output: ' + stderrLine);
      // })
      .on('error', function (err) {
        console.log('An error occurred: ' + err.message + JSON.stringify(source));
        reject(err);
      })
      .on('end', function (data) {
        console.log(data, 'data');
        // console.log('end');
        resolve();
      })
      .mergeToFile(target);
  });
};
