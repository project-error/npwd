export const parseObjectToIsoString = (obj: Record<string, unknown>) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (value instanceof Date) {
      obj[key] = value.toISOString();
      return;
    }

    if (typeof value === 'object') {
      obj[key] = parseObjectToIsoString(value as Record<string, unknown>);
      return;
    }

    /** If value is an array */
    if (Array.isArray(value)) {
      obj[key] = value.map((item) => {
        if (typeof item === 'object') {
          return parseObjectToIsoString(item as Record<string, unknown>);
        }

        return item;
      });
    }

    obj[key] = value;
  });

  return obj;
};
