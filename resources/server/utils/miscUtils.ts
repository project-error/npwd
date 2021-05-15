// Will apply any type to source
export const getSource = () => (global as any).source;

// Will clean string of any character that isn't 0-9, or a-z
export const clean = (input: string) => (input ? input.replace(/[^0-9a-z]/gi, '') : input);
