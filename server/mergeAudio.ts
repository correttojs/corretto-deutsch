import * as ffmpegPath from 'ffmpeg-static';
import * as ffprobePath from 'ffprobe-static';
import * as ffmpeg from 'fluent-ffmpeg';
process.env.FFPROBE_PATH = ffprobePath.path;
process.env.FFMPEG_PATH = ffmpegPath.path;
const SILENCE = './audio/silence1.mp3';
const BUTTON = './audio/button.mp3';
const nullAudio = 'https://quizlet.com/null';
ffmpeg(BUTTON).ffprobe(function(err, data) {
  console.log('file2 metadata:');
  console.dir(data);
});
export const mergeAudio = (source: string[], target: string, twice: boolean) => {
  console.log('merging');
  source = source.map(i => (i === nullAudio ? SILENCE : i));
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
        console.log('An error occurred: ' + err.message + JSON.stringify(source));
        reject(err);
      })
      .on('end', function(data) {
        console.log(data, 'data');
        // console.log('end');
        resolve();
      })
      .mergeToFile(target);
  });
};

mergeAudio([BUTTON, SILENCE], './tmp/test.mp3', false);
const safeGet = (x,a1,a2) => {
	
}

const y = {c:{a:{b:{C:3}}}};
           
const xt = safeGet(y, "a","s")