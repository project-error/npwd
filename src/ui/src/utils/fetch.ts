export const fetch = async (url: string, options: RequestInit = {}) => {
  const response = await window.fetch(`http://localhost:3001${url}`, {
    ...options,
    method: 'POST',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
