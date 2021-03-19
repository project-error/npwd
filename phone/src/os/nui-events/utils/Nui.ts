export interface IAbortableFetch {
  abort: () => void;
  promise: Promise<Response>;
}

function abortableFetch(request, opts): IAbortableFetch {
  const controller = new AbortController();
  const signal = controller.signal;

  return {
    abort: () => controller.abort(),
    promise: fetch(request, { ...opts, signal }),
  };
}

function getParams(event, data): [RequestInfo, RequestInit] {
  return [
    `https://new-phone-who-dis/${event}`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    },
  ];
}

export default {
  async send(event: any, data = {}) {
    return fetch(...getParams(event, data));
  },
  sendAbortable(event: any, data = {}): IAbortableFetch {
    return abortableFetch(...getParams(event, data));
  },
};
