let ESX = null;

setTick(() => {
  while (ESX === null) {
    emit('esx:getSharedObject', (obj) => ESX = obj);
  }
});