export const detectLanguage = (text: string) => {
  if (/[A_Za-z]/.test(text)) return 'en';
  if (/[А-Яа-я]/.test(text)) return 'ru';
};
