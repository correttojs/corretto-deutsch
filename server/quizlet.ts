import fetch from 'node-fetch';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';

const HEADER = {
  headers: { 'user-agent': UA },
};

export const fetchMe = async (url: string) => {
  console.log(url);
  const r = await fetch(url, HEADER)
    .then(r => r.json())
    .catch(e => console.log(e));
  if (r.responses[0].error) {
    throw new Error(r.responses[0].error.message);
  }
  return r.responses[0].models;
};

export const getSets = async (feedId: number) => {
  const sets = await fetchMe(
    `https://quizlet.com/webapi/3.2/feed/${feedId}/created-sets?filters[isPublished]=true`,
  );
  return sets.set.filter(x => !x.isDeleted);
};

export const getSet = async (setId: number) => {
  const sets = await fetchMe(`https://quizlet.com/webapi/3.2/sets/${setId}`);
  return sets.set[0];
};

export const getTerms = async (setId: number) => {
  const terms = await fetchMe(
    `https://quizlet.com/webapi/3.2/terms?filters[setId]=${setId}&[isPublished]=true`,
  );
  return terms.term.filter(x => !x.isDeleted);
};

export const getTerm = async (termId: number) => {
  const terms = await fetchMe(`https://quizlet.com/webapi/3.2/terms/${termId}`);
  return terms.term[0];
};

export const getAudio = (url: string) => {
  return `https://quizlet.com/${url}`;
};
