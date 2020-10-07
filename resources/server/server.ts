onNet("helloserver", () => {
  const _source = (global as any).source;

  const test = (x) => x;
  console.log(`Hello from ${_source}`);

  emitNet("helloclient", _source, "i got your message!");
});
