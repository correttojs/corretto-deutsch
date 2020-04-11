import * as textToSpeech from '@google-cloud/text-to-speech';

export const textToMp3 = async (text: string, languageCode: string) => {
  const client = new textToSpeech.TextToSpeechClient();
  const request = {
    input: { text },
    voice: { languageCode, ssmlGender: 'NEUTRAL' as const },
    audioConfig: { audioEncoding: 'MP3' as const },
  };
  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
};
