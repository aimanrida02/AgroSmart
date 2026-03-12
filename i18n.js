import i18n from 'i18n-js';

const translations = {
  en: require('./en.json'),
  hi: require('./hi.json'),
  te: require('./te.json'),
};

i18n.translations = translations;
i18n.locale = 'en';
i18n.fallbacks = true;

export default i18n;