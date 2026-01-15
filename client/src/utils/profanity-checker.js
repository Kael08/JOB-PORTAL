import profanityDictionary from './profanity-dictionary.json';

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\sа-яё]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsProfanity(text) {
  if (!text) return false;

  const profanityWords = profanityDictionary.words || [];
  if (profanityWords.length === 0) {
    return false;
  }

  const normalizedText = normalizeText(text);
  const words = normalizedText.split(/\s+/);

  for (const word of words) {
    if (profanityWords.some(profanity => normalizeText(profanity) === word)) {
      return true;
    }

    if (profanityWords.some(profanity => word.includes(normalizeText(profanity)))) {
      return true;
    }
  }

  for (const profanity of profanityWords) {
    const normalizedProfanity = normalizeText(profanity);
    if (normalizedText.includes(normalizedProfanity)) {
      return true;
    }
  }

  return false;
}

export function validateProfanity(text, fieldName) {
  if (!text) return null;

  if (containsProfanity(text)) {
    return `В поле "${fieldName}" обнаружено недопустимое содержание. Пожалуйста, используйте корректные выражения.`;
  }

  return null;
}

export function validateMultipleFields(fields) {
  const errors = {};
  let hasErrors = false;

  for (const [fieldName, value] of Object.entries(fields)) {
    const error = validateProfanity(value, fieldName);
    if (error) {
      errors[fieldName] = error;
      hasErrors = true;
    }
  }

  return hasErrors ? errors : null;
}

export function validateSkills(skills) {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return null;
  }

  for (const skill of skills) {
    let skillValue = '';
    
    if (typeof skill === 'string') {
      skillValue = skill;
    } else if (skill && typeof skill === 'object') {
      skillValue = skill.value || skill.label || '';
    }

    if (skillValue) {
      const error = validateProfanity(skillValue, 'Навыки');
      if (error) {
        return error;
      }
    }
  }

  return null;
}

