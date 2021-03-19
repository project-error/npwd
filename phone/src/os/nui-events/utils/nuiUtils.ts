export const eventNameFactory = (app: string, method: string) => `${app}:${method}`;

export const eventNameMethod = (name: string) => name.split(':')[1] || null;
