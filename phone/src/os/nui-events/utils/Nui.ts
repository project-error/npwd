// eslint-disable-next-line
export default {
  async send(event: any, data = {}) {
    /* eslint-disable no-unreachable */
    return fetch(`https://new-phone-who-dis/${event}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });
  },
};
