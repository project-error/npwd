interface DebugEvent {
  app: string;
  method: string;
  data: any;
}

// TODO: This should be unit tested

/**
 * Will mock data as if it were coming from an NUI message event
 * @param events {DebugEvent[]} An array of debug events
 * @example
 * InjectDebugData([
 *  {
 *   app: 'CAMERA',
 *   method: 'setPhotos',
 *   data: [
 *    {
 *      id: 1,
 *      image: 'https://i.imgur.com/OO8wx6Z.jpg',
 *    },
 *    {
 *      id: 2,
 *      image: 'https://i.imgur.com/OO8wx6Z.jpg',
 *    }
 *   ]
 *  }
 * ])
 **/
const InjectDebugData = (events: DebugEvent[], timer = 1000) => {
  if (process.env.NODE_ENV === 'development') {
    for (const event of events) {
      setTimeout(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              app: event.app,
              method: event.method,
              data: event.data,
            },
          })
        );
      }, timer);
    }
  }
};

export default InjectDebugData;
