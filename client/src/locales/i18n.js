import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en.json';
import ruTranslation from './ru.json';
import klmTranslation from './klm.json'

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'ru';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      klm: {
        translation: klmTranslation
      },
      ru: {
        translation: ruTranslation
      }
    },
    lng: savedLanguage, // default language
    fallbackLng: 'klm',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    pluralSeparator: '_',
    // Russian pluralization rules
    pluralRules: {
      ru: (count) => {
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod10 === 1 && mod100 !== 11) return 'one';
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
        return 'many';
      }
    }
  });

export default i18n;
