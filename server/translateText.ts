import { Translate } from '@google-cloud/translate';

export const translateText = async (text: string): Promise<string> => {
  const translate = new Translate({ projectId: 'germantomp3' });
  const [translation] = await translate.translate(text, 'it');
  console.log(translation);
  return translation;
};
