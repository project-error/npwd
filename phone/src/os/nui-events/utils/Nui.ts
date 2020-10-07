export default {
  async send(event, data = {}) {
    // /// #if DEBUG
    //return new Promise(resolve => setTimeout(resolve, 100));
    // /// #endif

    /* eslint-disable no-unreachable */
    return fetch(`http://new-phone-who-dis/${event}`, {
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    });
    /* eslint-enable no-unreachable  */
  },
};
