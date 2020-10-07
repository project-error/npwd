setImmediate(() => {
  emitNet("helloserver");
});

onNet("helloclient", (message) => {
  console.log(`The server replied: ${message}`);
});
