import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

const mode = process.env.NODE_ENV === 'production' ? 'LIVE' as const : 'DRY_RUN' as const;

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode }),
    detectBot({
      mode,
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
    }),
    slidingWindow({
      mode,
      max: 5,
      interval: '2s',
    }),
  ],
});

export default aj;
