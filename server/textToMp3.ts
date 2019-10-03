import * as textToSpeech from '@google-cloud/text-to-speech';

export const textToMp3 = async (text: string, languageCode: string): Promise<any> => {
  const client = new textToSpeech.TextToSpeechClient();
  const request = {
    input: { text },
    voice: { languageCode, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };
  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
};
