import * as ffmpegPath from 'ffmpeg-static';
import * as ffprobePath from 'ffprobe-static';
import * as ffmpeg from 'fluent-ffmpeg';
process.env.FFPROBE_PATH = ffprobePath.path;
process.env.FFMPEG_PATH = ffmpegPath.path;
const SILENCE = './audio/silence1.mp3';
const BUTTON = './audio/button.mp3';
export const mergeAudio = (source: string[], target: string, twice: boolean) => {
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
      source.forEach(s => {
        if (s) {
          f.input(s)
            .input(BUTTON)
            .input(SILENCE);
        }
      });
    }

    f.on('start', function(commandLine) {
      // console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
      // .on('progress', function(progress) {
      //   console.log('Processing: ' + progress.percent + '% done');
      // })
      // .on('stderr', function(stderrLine) {
      //   console.log('Stderr output: ' + stderrLine);
      // })
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        reject(err);
      })
      .on('end', function() {
        // console.log('end');
        resolve();
      })
      .mergeToFile(target);
  });
};
