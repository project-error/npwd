export const eventNameFactory = (app, method) => `${app}:${method}`;
export const eventNameMethod = (name) => name.split(":")[1] || null;
