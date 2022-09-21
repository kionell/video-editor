import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'ru', 'ua'],
    fallbackLng: 'en',
    detection: {
      order: ['cookie', 'localStorage'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
  });
