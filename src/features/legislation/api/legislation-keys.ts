export const legislationKeys = {
  base: ['legislation'] as const,

  list: (filters: string) =>
    [...legislationKeys.base, 'list', filters] as const,
};
