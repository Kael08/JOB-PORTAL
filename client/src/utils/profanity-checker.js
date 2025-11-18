/**
 * Утилита для проверки текста на наличие матерных слов
 * Использует словарь из файла profanity-dictionary.json
 */

import profanityDictionary from './profanity-dictionary.json';

/**
 * Нормализует текст для проверки (приводит к нижнему регистру, удаляет знаки препинания)
 * @param {string} text - Текст для нормализации
 * @returns {string} Нормализованный текст
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\sа-яё]/gi, '') // Удаляем все знаки препинания, оставляем только буквы и цифры
    .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
    .trim();
}

/**
 * Проверяет, содержит ли текст матерные слова
 * @param {string} text - Текст для проверки
 * @returns {boolean} true если найдено матерное слово, false если нет
 */
function containsProfanity(text) {
  if (!text) return false;

  const profanityWords = profanityDictionary.words || [];
  if (profanityWords.length === 0) {
    // Если словарь пуст, не блокируем
    return false;
  }

  const normalizedText = normalizeText(text);
  const words = normalizedText.split(/\s+/);

  // Проверяем каждое слово из текста
  for (const word of words) {
    // Проверяем точное совпадение
    if (profanityWords.some(profanity => normalizeText(profanity) === word)) {
      return true;
    }

    // Проверяем, содержит ли слово матерное слово (для случаев типа "слово_мат")
    if (profanityWords.some(profanity => word.includes(normalizeText(profanity)))) {
      return true;
    }
  }

  // Также проверяем, содержит ли весь текст матерное слово целиком
  for (const profanity of profanityWords) {
    const normalizedProfanity = normalizeText(profanity);
    if (normalizedText.includes(normalizedProfanity)) {
      return true;
    }
  }

  return false;
}

/**
 * Проверяет текст на наличие матерных слов и возвращает сообщение об ошибке, если найдено
 * @param {string} text - Текст для проверки
 * @param {string} fieldName - Название поля (для сообщения об ошибке)
 * @returns {string|null} Сообщение об ошибке или null если ошибок нет
 */
export function validateProfanity(text, fieldName) {
  if (!text) return null; // Пропускаем пустые значения

  if (containsProfanity(text)) {
    return `В поле "${fieldName}" обнаружено недопустимое содержание. Пожалуйста, используйте корректные выражения.`;
  }

  return null;
}

/**
 * Проверяет несколько текстовых полей на наличие матерных слов
 * @param {Object} fields - Объект с полями для проверки { fieldName: value }
 * @returns {Object|null} Объект с ошибками { fieldName: errorMessage } или null если ошибок нет
 */
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

/**
 * Проверяет массив навыков на наличие матерных слов
 * Навыки могут быть в формате: string[] или Array<{value: string, label?: string}>
 * @param {Array} skills - Массив навыков для проверки
 * @returns {string|null} Сообщение об ошибке или null если ошибок нет
 */
export function validateSkills(skills) {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return null;
  }

  for (const skill of skills) {
    let skillValue = '';
    
    // Обрабатываем разные форматы навыков
    if (typeof skill === 'string') {
      skillValue = skill;
    } else if (skill && typeof skill === 'object') {
      // Для объектов берем value или label
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

