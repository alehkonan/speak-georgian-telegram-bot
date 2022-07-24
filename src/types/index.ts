export type TranslatorResponse = {
  data?: {
    translations: { translatedText: string }[];
  };
  error?: {
    code: number;
    message: string;
    errors: {
      message: string;
      domain: string;
      reason: string;
    }[];
    details: {
      '@type': string;
      fieldViolations: { field: string; description: string }[];
    }[];
  };
};
