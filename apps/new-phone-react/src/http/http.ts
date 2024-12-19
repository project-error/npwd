export async function fetchApi<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json() as Promise<T>;
}

export async function fxFetch<T = unknown, D = unknown>(eventName: string, data?: D): Promise<T> {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  // @ts-expect-error global nui property
  const resourceName = (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : 'npwd';

  return await fetchApi<T>(`https://${resourceName}/${eventName}`, options);
}
